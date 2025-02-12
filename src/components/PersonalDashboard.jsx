import React, { useEffect, useState } from "react";
import { Await, Link, useNavigate } from "react-router-dom";
import "./styles/personaldash.css";

const PersonalDashboard = ({ userInfo }) => {
  const [personal, setPersonal] = useState();
  const [personalid, setPersonalId] = useState("");
  const [loading, setLoading] = useState(true);
  const [personalInfoFetched, setPersonalInfoFetched] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const BaseURL = "http://127.0.0.1:8000/";
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [catergoryFilter, setCategoryFilter] = useState("");
  const [AllUsers, setAllUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [PersonalInfo, setPersonalInfo] = useState({});
  const [FilteredUsers, setFilteredUsers] = useState([]);
  const [TaskForm, setTaskForm] = useState({
    taskTitle: "",
    taskDescription: "",
    dueDate: "",
    category: "",
    status: "TODO",
  });
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [userNotifications, setuserNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const response = await fetch(`${BaseURL}usercompanies/`, {
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
          },
        });
        const data = await response.json();
        console.log("personal data:", data);
        setPersonal(data.personal || {});
      } catch (error) {
        console.error("Error fetching personal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonal();
  }, []);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (personal && personal.id && !personalInfoFetched) {
        try {
          const response = await fetch(`${BaseURL}companies/`, {
            headers: {
              Authorization: `Bearer ${userInfo.access}`,
            },
          });
          const data = await response.json();
          setPersonalInfo(data.personal || {});
          setTasks(data.personal.tasks || []);
          setPersonalInfoFetched(true);
          setPersonalId(data.personal.id);
          console.log("PersonalInfo:", data);
        } catch (error) {
          console.error("Error fetching personal info:", error);
        }
      }
    };
    fetchPersonalInfo();
  }, [personal, personalInfoFetched, userInfo]);

  const API_URL = `http://127.0.0.1:8000/categories/${personalid}`;
  console.log("API URL:", API_URL);

  const DeletePersonal = async () => {
    try {
      const response = await fetch(
        `${BaseURL}create-personal/${userInfo?.user?.id}/${PersonalInfo?.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
          },
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error("Error deleting personal:", error);
    }
    navigate("/create-personal");
  };
  const AddTask = async (taskDetails) => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseURL}personal/${personal.id}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
        body: JSON.stringify(taskDetails),
      });
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
      category: TaskForm.category,
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
        `${BaseURL}personal/${personal?.id}/tasks/${taskid}/`,
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

  const DeleteTask = async (taskid) => {
    try {
      const response = await fetch(
        `${BaseURL}personal/${personal?.id}/tasks/${taskid}/`,
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
        `${BaseURL}personal/${personal.id}/tasks/${taskid}/`,
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

  const [PersonalView, setPersonalView] = useState("all_tasks");
  const handleView = (view) => {
    setPersonalView(view);
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

  const filteredTasks = PersonalInfo?.tasks?.filter((task) => {
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const categoryMatches = catergoryFilter
      ? task?.category?.id === parseInt(catergoryFilter)
      : true;
    const [startDate, endDate] = getDateRange(dateFilter);
    const taskDueDate = normalizeDate(new Date(task.due_date));
    const matchesDateRange =
      (!startDate || taskDueDate >= startDate) &&
      (!endDate || taskDueDate <= endDate);
    const matchesSearchQuery =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task?.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      matchesStatus && categoryMatches && matchesDateRange && matchesSearchQuery
    );
  });

  useEffect(() => {
    if (personalid) {
      const API_URL = `http://127.0.0.1:8000/categories/${personalid}`;
      console.log("API URL:", API_URL);

      const getCategories = async () => {
        try {
          const response = await fetch(`${API_URL}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo?.access}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            console.log("Categories:", data);
            setAllCategories(data.categories || []);
          } else {
            console.error(data.detail);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      getCategories();
    } else {
      console.log("help me");
    }
  }, [personalid, userInfo]);

  const createCategory = async (name, personalId) => {
    try {
      const response = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access}`,
        },
        body: JSON.stringify({
          name: name,
          personal: personalId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        location.reload();
        return data;
      } else {
        throw new Error(data.detail);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const updateCategory = async (categoryId, name, personalId) => {
    try {
      const response = await fetch(`${API_URL}/${categoryId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access}`,
        },
        body: JSON.stringify({
          name: name,
          personal: personalId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        location.reload();
        return data;
      } else {
        throw new Error(data.detail);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${API_URL}/${categoryId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access}`,
        },
      });
      if (response.ok) {
        location.reload();
        return { detail: "Category deleted" };
      } else {
        const data = await response.json();
        throw new Error(data.detail);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (userInfo?.user?.is_superuser) {
    return (
      <div className="ElseContainer">
        <p>Super User detected, navigate to this view to see all personals</p>
        <Link to="/all-dashboard">Super admin dashboard</Link>
      </div>
    );
  }
  if (isEmpty(personal) && !userInfo?.user?.is_superuser) {
    return (
      <div className="ElseContainer">
        <p>You are not part of any personal.</p>
        <Link to="/create-personal">
          <b>Create Personal</b>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="container-dashboard">
        <aside className="Sidebar">
          <nav className="SideNav">
            <li className="SideNavItem">
              <button
                className="SideNavLink"
                onClick={() => handleView("all_tasks")}
              >
                All Tasks
              </button>
            </li>
            <li className="SideNavItem">
              <button
                className="SideNavLink"
                onClick={() => handleView("notifications")}
              >
                All Notifications
              </button>
            </li>
            <li className="SideNavItem">
              <button
                className="SideNavLink"
                onClick={() => handleView("categories")}
              >
                All Categories
              </button>
            </li>
            <li className="SideNavItem">
              <button
                className="SideNavLink"
                onClick={() => handleView("add_task")}
              >
                Add Task
              </button>
            </li>
          </nav>
        </aside>
        <div className="PersonalDashboardMain">
          <div className="PersonalDashboardHeader">
            <h2 className="PersonalDashboardInfoDetailTitle">
              {personal?.name}
            </h2>
            <button
              className="DeletePersonalButton"
              onClick={() => {
                const confirmRemoval = window.confirm(
                  `Are you sure you want to delete your personal?`
                );
                if (confirmRemoval) {
                  DeletePersonal();
                }
              }}
            >
              Delete Personal
            </button>
          </div>
          {PersonalView === "all_tasks" && (
            <div className="PersonalDashboardTasks">
              <div className="PersonalDashboardTasksMain">
                <div className="Filters">
                  <input
                    type="text"
                    placeholder="Search tasks"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    <select
                      value={catergoryFilter}
                      className="select filter"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {allCategories.map((category) => (
                        <option value={category.id} key={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="PersonalDashboardTasksList">
                  {filteredTasks?.length > 0 ? (
                    filteredTasks.map((task) => {
                      return (
                        <div key={task.id} className="PersonalDashboardTask">
                          <h3 className="PersonalDashboardTaskTitle">
                            {task.title}
                          </h3>
                          <p className="PersonalDashboardTaskDescription">
                            {task.description}
                          </p>
                          <p className="PersonalDashboardTaskDueDate">
                            Category: {task?.category?.name || "No category"}
                          </p>
                          <code className="PersonalDashboardTaskDueDate">
                            Due Date: {task.due_date}
                          </code>
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
                          <br />
                          <button
                            className="DeleteTaskBtn"
                            onClick={async () => {
                              const confirmRemoval = window.confirm(
                                `Are you sure you want to delete ${task.title}?`
                              );
                              if (confirmRemoval) {
                                await DeleteTask(task.id);
                              }
                            }}
                          >
                            Delete Task
                          </button>
                          <button
                            className="EditTaskBtn"
                            onClick={() => {
                              setEditingTaskId(task.id);
                              setTaskForm({
                                taskTitle: task.title,
                                taskDescription: task.description,
                                dueDate: task.due_date,
                                category: task.category.id,
                                status: task.status,
                              });
                              setPersonalView("add_task");
                            }}
                          >
                            Edit Task
                          </button>
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
                              {task.comments.length > 0 ? (
                                task.comments.map((comment) => (
                                  <div key={comment.id} className="Comment">
                                    <p className="CommentContent">
                                      {comment.text}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <div>No comments found</div>
                              )}
                            </article>
                          </details>
                        </div>
                      );
                    })
                  ) : (
                    <p>No tasks found</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {PersonalView === "notifications" && (
            <div className="NotificationsDashboard">
              <div className="NotificationsList">
                {userNotifications.length > 0 ? (
                  userNotifications
                    .filter((not) => !not.company)
                    .map((notification) => (
                      <div key={notification.id} className="NotificationCont">
                        <span>{notification?.created_at.split("T")[0]}</span>
                        <div className="NotificationHeader"> 
                          <p className="NotificationMessage">
                            {notification.message}
                          </p>
                          <button
                            onClick={() =>
                              delNotification(userInfo.user.id, notification.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No notifications found</p>
                )}
              </div>
            </div>
          )}
          {PersonalView === "add_task" && (
            <section className="AddingCompanyTask">
              <h3 className="AddTaskTitle">Add Task</h3>
              <form onSubmit={handleFormSubmit} className="AddTaskForm">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={TaskForm.taskTitle}
                  name="taskTitle"
                  onChange={handleChange}
                  required
                />
                <textarea
                  placeholder="Task Description"
                  value={TaskForm.taskDescription}
                  name="taskDescription"
                  onChange={handleChange}
                />
                <input
                  type="date"
                  value={TaskForm.dueDate}
                  name="dueDate"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="status">Category:</label>
                <br />
                <select
                  id="status"
                  name="status"
                  className="select categoryselect"
                  value={TaskForm.category}
                  onChange={(e) =>
                    setTaskForm({ ...TaskForm, category: e.target.value })
                  }
                >
                  <option value="">No category selected</option>
                  {allCategories.length > 0 ? (
                    allCategories.map((category) => (
                      <option value={category.id} key={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No category found</option>
                  )}
                </select>
                <input
                  type="submit"
                  value={editingTaskId ? "Update Task" : "Add Task"}
                />
              </form>
            </section>
          )}
          {PersonalView === "categories" && (
            <div className="CategoriesDashboard">
              <div className="AddCategoryDashboard">
                <h2 className="AddCategoryTitle">Add Category:</h2>
                <br />
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const categoryName = e.target.categoryName.value;
                    if (categoryName) {
                      await createCategory(categoryName, personal.id);
                      e.target.reset();
                    }
                  }}
                  className="AddCatForm"
                >
                  <input
                    type="text"
                    id="categoryName"
                    name="categoryName"
                    placeholder="Category Name"
                    required
                  />
                  <button type="submit" className="AddCategoryButton">
                    Add Category
                  </button>
                </form>
              </div>
              <h2 className="CategoriesTitle">Categories:</h2>
              <input
                type="text"
                placeholder="Search categories"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="CategoriesList">
                {allCategories
                  .filter((category) =>
                    category.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((category) => (
                    <div key={category.id} className="Category">
                      <p className="CategoryName">{category.name}</p>
                      <button
                        onClick={() => {
                          const newName = prompt(
                            "Enter new category name:",
                            category.name
                          );
                          if (newName) {
                            updateCategory(category.id, newName, personal.id);
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const confirmRemoval = window.confirm(
                            `Are you sure you want to delete ${category.name}?`
                          );
                          if (confirmRemoval) {
                            deleteCategory(category.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default PersonalDashboard;
