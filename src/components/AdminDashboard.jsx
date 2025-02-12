import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/admindash.css";
import AllCompanyUsers from "./AllCompanyUsers";
import AddNewCompanyUser from "./AddNewCompanyUser";
import AllCompanyTasks from "./AllCompanyTasks";
import AddNewCompanyTask from "./AddNewCompanyTask";
import AllCompanyNotifications from "./AllCompanyNotifications";

const AdminDashboard = ({ userInfo, setUserInfo }) => {
  const [company, setCompanies] = useState();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyInfoFetched, setCompanyInfoFetched] = useState(false);
  const BaseURL = "http://127.0.0.1:8000/";
  const [searchQuery, setSearchQuery] = useState("");
  const [TaskSearchQuery, setTaskSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [AllUsers, setAllUsers] = useState([]);
  const [CompanyInfo, setCompanyInfo] = useState({});
  const [FilteredUsers, setFilteredUsers] = useState([]);
  const [FilteredTasks, setFilteredTasks] = useState([]);
  const [CompanyUsers, SetCompanyUsers] = useState([]);
  const [FetchCount, setFetchCount] = useState(0);
  const [TaskForm, setTaskForm] = useState({
    taskTitle: "",
    taskDescription: "",
    dueDate: "",
    status: "TODO",
  });
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [userNotifications, setuserNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${BaseURL}usercompanies/`, {
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
          },
        });
        const data = await response.json();
        console.log("Companies data:", data);
        setCompanies(data.company || {});
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (company && !companyInfoFetched) {
        const firstCompany = company;
        if (firstCompany.id) {
          try {
            const response = await fetch(
              `${BaseURL}companies/${firstCompany.id}/`,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.access}`,
                },
              }
            );
            const data = await response.json();
            setCompanyInfo(data.company || {});
            setCompanyInfoFetched(true);
            console.log("CompanyInfo:", data);
          } catch (error) {
            console.error("Error fetching company info:", error);
          }
        }
      }
    };
    fetchCompanyInfo();
  }, [company, companyInfoFetched, userInfo]);

  const fetchUsers = async (userInfo, searchQuery = "") => {
    const endpoint = `${BaseURL}api/users/`;
    const headers = {
      Authorization: `Bearer ${userInfo.access}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await fetch(`${endpoint}?search=${searchQuery}`, {
        method: "GET",
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();
        setFetchCount((prev) => (prev += 1));
        console.log(FetchCount);
        return data.all_users;
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.detail);
        return null;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      const users = await fetchUsers(userInfo, searchQuery);
      setAllUsers(users);
    };
    if (userInfo) {
      getUsers();
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    const users = await fetchUsers(userInfo, searchQuery);
    setAllUsers(users);
  };
  const DeleteCompany = async () => {
    try {
      const response = await fetch(`${BaseURL}companies/${company.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
        },
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
    navigate("/create-company");
  };
  const InviteUser = async (e) => {
    const userid = e.target.value;
    try {
      setLoading(true);
      const response = await fetch(`${BaseURL}notifications/${userid}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
        body: JSON.stringify({ message: "Invite", company_id: company.id }),
      });

      if (!response.ok) {
        console.error(response.detail);
      }

      const data = await response.json();
      alert("User invited, awaiting response");
      console.log("Invited user,", data);
      // await AddUserToList(userid);
    } catch (error) {
      alert("Error inviting user");
      console.error(error);
    } finally {
      setLoading(false);
    }
    location.reload();
  };
  const AddTask = async (taskDetails) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BaseURL}companies/${company?.id}/tasks/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.access}`,
          },
          body: JSON.stringify(taskDetails),
        }
      );
      if (!response.ok) {
        throw new Error("Error creating task");
      }
      const data = await response.json();
      alert("Task created successfully");
      console.log("Created task:", data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error creating task");
      console.error("Error:", error);
    }
  };

  const fetchNotifications = async () => {
    const url = `${BaseURL}notifications/${userInfo?.user?.id}/`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo?.access}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setuserNotifications(data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      console.error(response.detail);
    }
  };

  const filterusers = () => {
    if (
      !CompanyInfo ||
      !CompanyInfo.noncompanyusers ||
      !Array.isArray(AllUsers) ||
      !AllUsers
    ) {
      return [];
    }
    const filtered_users = AllUsers
      ? AllUsers.filter((ranuser) =>
          CompanyInfo.noncompanyusers.some((user) => user.id == ranuser.id)
        )
      : [];
    const invite_filtered_users = filtered_users
      ? filtered_users.filter(
          (ranuser) =>
            !CompanyInfo.invited_users.some((user) => user == ranuser.id)
        )
      : [];

    setFilteredUsers(invite_filtered_users);
  };

  useEffect(() => {
    filterusers();
  }, [CompanyInfo, AllUsers]);

  const companyusers = () => {
    if (!CompanyInfo || !CompanyInfo.users) {
      return [];
    }

    const filtered_users = AllUsers
      ? AllUsers.filter((ranuser) =>
          CompanyInfo.users.some((user) => user.id === ranuser.id)
        )
      : [];
    SetCompanyUsers(filtered_users);
  };

  useEffect(() => {
    companyusers();
  }, [CompanyInfo, AllUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTaskForm({
      ...TaskForm,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const taskDetails = {
      title: TaskForm.taskTitle,
      description: TaskForm.taskDescription,
      assigned_to: assignedUsers.map((user) => user.id),
      due_date: TaskForm.dueDate,
      status: TaskForm.status,
    };

    if (editingTaskId) {
      await editTask(editingTaskId, taskDetails);
    } else {
      await AddTask(taskDetails);
    }
    setEditingTaskId(null);
    location.reload();
  };

  const editTask = async (taskid, updatedTaskDetails) => {
    try {
      const response = await fetch(
        `${BaseURL}companies/${company?.id}/tasks/${taskid}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.access}`,
          },
          body: JSON.stringify(updatedTaskDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Error editing task");
      }

      const data = await response.json();
      alert("Task updated successfully");
      console.log("Updated task:", data);
    } catch (error) {
      console.error("Error editing task:", error);
      alert("Failed to edit task");
    }
  };

  const addComment = async (taskId, commentText) => {
    try {
      const response = await fetch(`${BaseURL}tasks/${taskId}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        throw new Error("Error adding comment");
      }

      const data = await response.json();
      alert("Comment added successfully");
      console.log("Added comment:", data);
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
    location.reload();
  };

  const editComment = async (taskId, commentId, updatedCommentText) => {
    try {
      const response = await fetch(
        `${BaseURL}tasks/${taskId}/comments/${commentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.access}`,
          },
          body: JSON.stringify({ text: updatedCommentText }),
        }
      );

      if (!response.ok) {
        throw new Error("Error editing comment");
      }

      const data = await response.json();
      alert("Comment updated successfully");
      console.log("Updated comment:", data);
    } catch (error) {
      console.error("Error editing comment:", error);
      alert("Failed to edit comment");
    }
  };

  const removeUserFromCompany = async (userid) => {
    try {
      const response = await fetch(
        `${BaseURL}company/${company?.id}/users/${userid}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.access}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error(data.detail);
      }

      alert("User removed successfully");
      console.log("Removed user ID:", userid);
      navigate("/create-company");
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user");
    } finally {
      location.reload();
    }
  };

  const DeleteTask = async (taskid) => {
    try {
      const response = await fetch(
        `${BaseURL}companies/${company?.id}/tasks/${taskid}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.access}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      alert("Task deleted successfully");
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
    location.reload();
  };
  const updateTaskStatus = async (taskid, status) => {
    try {
      const response = await fetch(
        `${BaseURL}companies/${company.id}/tasks/${taskid}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.access}`,
          },
          body: JSON.stringify({ status: status }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating task status");
      }

      const data = await response.json();
      alert("Task status updated successfully");
      console.log("Updated task status:", data);
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status");
    }
    location.reload();
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${BaseURL}tasks/assignedto/${userInfo.user.id}/`
        );
        if (response.status == 204) {
          return console.log("User has no tasks assigned to him");
        } else if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
  const [CompView, setCompView] = useState("all_tasks");
  const handleView = (view) => {
    setCompView(view);
  };

  const isEmpty = (obj) => {
    if (obj == null) {
      return true;
    }
    return Object.keys(obj).length === 0;
  };

  const delNotification = (userid, notificationId) => {
    fetch(`${BaseURL}/notifications/${userid}/${notificationId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo?.access}`,
      },
    })
      .then((response) => {
        if (response.status === 204) {
          console.log("Notification deleted");
          alert("Notification deleted");
        } else if (response.status === 404) {
          return response.json().then((data) => {
            console.log(data.detail);
          });
        } else {
          return response.json().then((data) => {
            console.log(data.detail);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Notification not deleted");
      });
    location.reload();
  };
  const show = (state) => {
    const tasks = document.querySelector(".AllEmployeeTasks");
    const notifications = document.querySelector(".AllEmployeeNotifications");
    if (state) {
      tasks.style.display = "block";
      notifications.style.display = "none";
    } else {
      tasks.style.display = "none";
      notifications.style.display = "block";
    }
  };
  const getNotifications = async () => {
    const userId = userInfo?.user.id;
    try {
      setLoading(true);
      const response = await fetch(`${BaseURL}notifications/${userId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error inviting user");
      }

      const data = await response.json();
      console.log(data.detail);
      console.table(data.notifications);
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed getting notifications.", error.message);
    } finally {
      setLoading(false);
    }
  };
  const acceptOrDeclineInvite = async (companyid, method) => {
    const url = `${BaseURL}accept_or_decline_invite/${userInfo?.user.id}/${companyid}/`;
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to process the request.");
      }

      const data = await response.json();
      console.log(data);

      if (method === "POST") {
        console.log("User added to the company");
      } else if (method === "DELETE") {
        console.log("Company offer declined");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    location.reload();
  };

  const filtered_notifications = notifications.filter((notification) => {
    return notification.message === "Invite";
  });
  const normalizeDate = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getDateRange = (filter) => {
    const today = normalizeDate(new Date(Date.now()));
    const tomorrow = normalizeDate(new Date(today));
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = normalizeDate(new Date(today));
    nextWeek.setDate(today.getDate() + 7);
    const afterNextWeek = normalizeDate(new Date(today));
    afterNextWeek.setDate(today.getDate() + 14);

    switch (filter) {
      case "TODAY":
        return [today, today];
      case "TOMORROW":
        return [tomorrow, tomorrow];
      case "NEXT_WEEK":
        return [today, nextWeek];
      case "AFTER_NEXT_WEEK":
        return [nextWeek, null];
      default:
        return [null, null];
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const [startDate, endDate] = getDateRange(dateFilter);
    const taskDueDate = normalizeDate(new Date(task.due_date));
    const matchesDateRange =
      (!startDate || taskDueDate >= startDate) &&
      (!endDate || taskDueDate <= endDate);
    const matchesSearchQuery =
      task.title.toLowerCase().includes(TaskSearchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(TaskSearchQuery.toLowerCase());
    return matchesStatus && matchesDateRange && matchesSearchQuery;
  });
  useEffect(() => {
    getNotifications();
  }, []);

  if (isEmpty(company) && !userInfo?.user?.is_superuser) {
    return (
      <>
        <div className="ElseContainer">
          <p>
            You are not part of any company. Create one or accept an invite.
          </p>
          <Link to="/create-company" className="CreateCompanyLink">
            Create Company
          </Link>
        </div>
        <section className="InvitesCont">
          <h3 className="InvitesHead">Invites</h3>
          {filtered_notifications.length > 0 ? (
            filtered_notifications.map((notification) => (
              <div className="NotificationCont" key={notification.created_at}>
                <p className="NotificationCompany">
                  {notification?.company?.name} has invited you to join the
                  company
                </p>
                <button
                  onClick={() =>
                    acceptOrDeclineInvite(notification.company.id, "POST")
                  }
                  className="InviteButton"
                >
                  Accept invite
                </button>
                <button
                  onClick={() =>
                    acceptOrDeclineInvite(notification.company.id, "DELETE")
                  }
                  className="InviteButton"
                >
                  Decline invite
                </button>
              </div>
            ))
          ) : (
            <p className="NotificationCompany">No invites yet</p>
          )}
        </section>
      </>
    );
  }
  if (userInfo?.user?.is_superuser) {
    return (
      <div className="ElseContainer">
        <p>Super User detected, navigate to this view to see all companies</p>
        <Link to="/all-dashboard">Super admin dashboard</Link>
      </div>
    );
  } else if (CompanyInfo?.admin !== userInfo.user.id && !isEmpty(company)) {
    return (
      <div className="container-dashboard">
        <aside className="Sidebar">
          <nav className="SideNav">
            <li className="SideNavItem">
              <button className="SideNavLink" onClick={() => show(true)}>
                All Tasks
              </button>
            </li>
            <li className="SideNavItem">
              <button
                className="SideNavLink"
                onClick={() => {
                  show(false);
                  fetchNotifications();
                }}
              >
                All Notifications
              </button>
            </li>
          </nav>
        </aside>
        <aside>
          <aside className="NameAndLeave">
            <h1 className="CompanyName">{company.name}</h1>
            <button
              className="RemoveUserButton"
              onClick={async () => {
                const confirmRemoval = window.confirm(
                  `Are you sure you want to leave ${company.name}?`
                );
                if (confirmRemoval) {
                  await removeUserFromCompany(userInfo?.user?.id);
                }
              }}
            >
              Leave
            </button>
          </aside>
          <section className="TaskCompany">
            <div className="AllEmployeeTasks">
              <div className="Filters">
                <input
                  type="text"
                  placeholder="Search tasks"
                  value={TaskSearchQuery}
                  onChange={(e) => setTaskSearchQuery(e.target.value)}
                />
                <div className="selects">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select filter"
                  >
                    <option value="">All Statuses</option>
                    <option value="TODO">To do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="select filter"
                  >
                    <option value="">All Dates</option>
                    <option value="TODAY">Today</option>
                    <option value="TOMORROW">Tomorrow</option>
                    <option value="NEXT_WEEK">Next Week</option>
                    <option value="AFTER_NEXT_WEEK">After Next Week</option>
                  </select>
                </div>
              </div>
              <div className="PersonalDashboardTasksList">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => {
                    return (
                      <li key={task.id} className="Task">
                        <div className="TaskCont">
                          <h3 className="TaskTitle">{task.title}</h3>
                          <p className="TaskDesc">{task.description}</p>
                          <code className="TaskDueDate">
                            Due date: {task.due_date}
                          </code>
                          <br />
                          <br />
                          <select
                            value={task.status}
                            className="select"
                            onChange={(e) =>
                              updateTaskStatus(task.id, e.target.value)
                            }
                          >
                            <option value="TODO">To do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                          <details className="AllComments">
                            <summary className="CommentsLabel">
                              Comments:
                            </summary>
                            <input
                              type="text"
                              placeholder="Add a comment"
                              value={newCommentText}
                              onChange={(e) =>
                                setNewCommentText(e.target.value)
                              }
                            />
                            <button
                              onClick={async () => {
                                if (!newCommentText.trim()) return;
                                await addComment(task.id, newCommentText);
                                setNewCommentText("");
                              }}
                            >
                              Add Comment
                            </button>

                            <article className="TaskComments">
                              {task.comments.map((comment) => (
                                <div key={comment.id} className="Comment">
                                  <h3 className="CommentUser">
                                    {comment.user}
                                  </h3>
                                  <p className="CommentContent">
                                    {comment.text}
                                  </p>
                                </div>
                              ))}
                            </article>
                          </details>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <p>No tasks assigned</p>
                )}
              </div>
            </div>
            <div className="AllEmployeeNotifications">
              <section className="AllCompNotificationsCont">
                <div className="AllNotifications">
                  {userNotifications?.length > 0 ? (
                    userNotifications.map((notification) => (
                      <div className="NotificationCont" key={notification.id}>
                        <div>
                          <h2 className="NotificationTitle">
                            New notification
                          </h2>
                          <div className="NotificationMessageAndBtnCont">
                            <span>
                              {notification?.created_at.split("T")[0]}
                            </span>
                            <p className="NotificationMessage">
                              {notification.message}
                            </p>
                            <button
                              onClick={() =>
                                delNotification(
                                  notification.user,
                                  notification.id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="NoNotifications">No notifications</p>
                  )}
                </div>
              </section>
            </div>
          </section>
        </aside>
      </div>
    );
  } else if (CompanyInfo?.admin == userInfo.user.id) {
    return (
      <div className="container-dashboard">
        <aside className="Sidebar">
          <nav className="SideNav">
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("company_users")}
                className="SideNavLink"
              >
                All Company Users
              </button>
            </li>{" "}
            {/* users */}
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("all_tasks")}
                className="SideNavLink"
              >
                All Tasks
              </button>
            </li>{" "}
            {/* tasks */}
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("notifications")}
                className="SideNavLink"
              >
                All Notifications
              </button>
            </li>{" "}
            {/* notifications */}
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("add_user")}
                className="SideNavLink"
              >
                Invite User
              </button>
            </li>{" "}
            {/* invite users */}
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("add_task")}
                className="SideNavLink"
              >
                Add Task
              </button>
            </li>{" "}
            {/* add task */}
          </nav>
        </aside>
        {company ? (
          <main className="main-container">
            <aside className="NameAndLeave">
              <h1 className="CompanyName">{company.name}</h1>
              <button
                className="RemoveUserButton"
                onClick={async () => {
                  const confirmRemoval = window.confirm(
                    `Are you sure you want to delete ${company.name}?`
                  );
                  if (confirmRemoval) {
                    await DeleteCompany();
                  }
                }}
              >
                Delete Company
              </button>
            </aside>
            {CompView === "company_users" && (
              <AllCompanyUsers
                CompanyInfo={CompanyInfo}
                CompanyUsers={CompanyUsers}
                removeUserFromCompany={removeUserFromCompany}
              />
            )}
            {CompView === "add_user" && (
              <AddNewCompanyUser
                InviteUser={InviteUser}
                searchQuery={searchQuery}
                FilteredUsers={FilteredUsers}
                setSearchQuery={setSearchQuery}
              />
            )}
            {CompView === "all_tasks" && (
              <AllCompanyTasks
                CompanyInfo={CompanyInfo}
                updateTaskStatus={updateTaskStatus}
                DeleteTask={DeleteTask}
                addComment={addComment}
                newCommentText={newCommentText}
                setNewCommentText={setNewCommentText}
                CompanyUsers={CompanyUsers}
                setTaskForm={setTaskForm}
                setEditingTaskId={setEditingTaskId}
                assignedUsers={assignedUsers}
                setAssignedUsers={setAssignedUsers}
                handleView={handleView}
              />
            )}
            {CompView === "add_task" && (
              <AddNewCompanyTask
                handleFormSubmit={handleFormSubmit}
                TaskForm={TaskForm}
                handleChange={handleChange}
                CompanyInfo={CompanyInfo}
                assignedUsers={assignedUsers}
                setAssignedUsers={setAssignedUsers}
                editingTaskId={editingTaskId}
              />
            )}
            {CompView === "notifications" && (
              <AllCompanyNotifications
                CompanyInfo={CompanyInfo}
                delNotification={delNotification}
              />
            )}
          </main>
        ) : (
          <div className="ElseContainer">
            <p>You are not part of any company.</p>
            <Link to="/create-company">Create Company</Link>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="ElseContainer">
        <p>You are not part of any company.</p>
        <Link to="/create-company">Create Company</Link>
      </div>
    );
  }
};

export default AdminDashboard;
