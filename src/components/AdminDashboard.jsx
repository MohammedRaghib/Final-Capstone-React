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
  const [loading, setLoading] = useState(true);
  const [companyInfoFetched, setCompanyInfoFetched] = useState(false);
  const BaseURL = "http://127.0.0.1:8000/";
  const [searchQuery, setSearchQuery] = useState("");
  const [AllUsers, setAllUsers] = useState([]);
  const [CompanyInfo, setCompanyInfo] = useState({});
  const [FilteredUsers, setFilteredUsers] = useState([]);
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
        setCompanies(data.companies || {});
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
            setCompanyInfo(data);
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
    if (!userInfo?.user?.personal) {
      navigate("/create-company");
    } else {
      deletePersonalSystem();
    }
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
  const deletePersonalSystem = async () => {
    if (!userInfo?.user?.id) {
      console.error("User ID is required");
      return;
    }

    try {
      const response = await fetch(
        `${BaseURL}/create-personal/${userInfo?.user?.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data.detail);
        const info = JSON.parse(localStorage.getItem("userInfo"));
        info.user.personal = false;
        const savedinfo = localStorage.setItem(
          "userInfo",
          JSON.stringify(info)
        );
        setUserInfo(info);
      } else {
        console.error("Error:", data.detail);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert(`Error: ${response.detail}`);
    }
    navigate("/create-company");
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
    // setFilteredUsers(filtered_users);
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
  const [CompView, setCompView] = useState("notifications");
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
          alert("Notification marked as read");
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
        alert("Notification not marked as read");
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
  if (isEmpty(company) && !userInfo?.user?.is_superuser) {
    return (
      <div className="ElseContainer">
        <p>You are not part of any company.</p>
        <Link to="/create-company">Create Company</Link>
      </div>
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
        <section className="TaskCompany">
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
          <div className="AllEmployeeTasks">
            {tasks.length > 0 ? (
              tasks.map((task) => {
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
                        <summary className="CommentsLabel">Comments:</summary>
                        <input
                          type="text"
                          placeholder="Add a comment"
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
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
                              <h3 className="CommentUser">{comment.user}</h3>
                              <p className="CommentContent">{comment.text}</p>
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
          <div className="AllEmployeeNotifications">
            <section className="AllCompNotificationsCont">
              <div className="AllNotifications">
                {userNotifications?.length > 0 ? (
                  userNotifications.map((notification) => (
                    <div className="NotificationCont" key={notification.id}>
                      <div>
                        <h2 className="NotificationTitle">New notification</h2>
                        <div className="NotificationMessageAndBtnCont">
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
                            Mark as read
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
      </div>
    );
  } else if (
    CompanyInfo?.admin == userInfo.user.id &&
    !userInfo?.user?.personal
  ) {
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
  } else if (userInfo?.user?.personal) {
    return (
      <div className="container-dashboard">
        <aside className="Sidebar">
          <nav className="SideNav">
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("all_tasks")}
                className="SideNavLink"
              >
                All Tasks
              </button>
            </li>
            {/* tasks */}
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("notifications")}
                className="SideNavLink"
              >
                All Notifications
              </button>
            </li>
            {/* notifications */}
            {/* invite users */}
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("add_task")}
                className="SideNavLink"
              >
                Add Task
              </button>
            </li>
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
