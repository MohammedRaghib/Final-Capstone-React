import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import AllCompanyUsers from "./AllCompanyUsers";
import AddNewCompanyUser from "./AddNewCompanyUser";
import AllCompanyTasks from "./AllCompanyTasks";
import AddNewCompanyTask from "./AddNewCompanyTask";

function OneCompanyDetails({ userInfo }) {
  const location = useLocation();
  const company = location.state;
  const CompanyInfo = company.company;
  const [CompView, setCompView] = useState("CompanyInfo_users");
  const [loading, setLoading] = useState(true);
  const BaseURL = "http://127.0.0.1:8000/";
  const [searchQuery, setSearchQuery] = useState("");
  const [AllUsers, setAllUsers] = useState([]);
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
  const navigate = useNavigate();

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
        body: JSON.stringify({
          message: "Invite",
          CompanyInfo_id: CompanyInfo.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error inviting user");
      }

      const data = await response.json();
      alert("User invited, awaiting response");
      console.log("Invited user,", data);
    } catch (error) {
      alert("Error inviting user");
      console.error(error);
    } finally {
      setLoading(false);
      navigate("/all-dashboard");
    }
  };

  const AddTask = async (taskDetails) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BaseURL}companies/${CompanyInfo?.id}/tasks/`,
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
    } finally {
      navigate("/all-dashboard");
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

    setFilteredUsers(filtered_users);
  };

  useEffect(() => {
    filterusers();
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
        `${BaseURL}companies/${CompanyInfo?.id}/tasks/${taskid}/`,
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
    navigate("/all-dashboard");
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
    navigate("/all-dashboard");
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
        `${BaseURL}CompanyInfo/${CompanyInfo?.id}/users/${userid}/`,
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
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user");
    } finally {
      navigate("/all-dashboard");
    }
  };

  const DeleteTask = async (taskid) => {
    try {
      const response = await fetch(
        `${BaseURL}companies/${CompanyInfo?.id}/tasks/${taskid}/`,
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
    navigate("/all-dashboard");
  };

  const updateTaskStatus = async (taskid, status) => {
    try {
      const response = await fetch(
        `${BaseURL}companies/${CompanyInfo?.id}/tasks/${taskid}/`,
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
    navigate("/all-dashboard");
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

  const isEmpty = (obj) => {
    if (obj == null) {
      return true;
    }
    return Object.keys(obj).length === 0;
  };
  const handleView = (view) => {
    setCompView(view);
  };
  if (!CompanyInfo) {
    return (
      <div className="ElseContainer">
        <p>No CompanyInfo details fetched, go to the dashboard to find one.</p>
        <Link to="/all-dashboard">Dashboard</Link>
      </div>
    );
  } else {
    return (
      <div className="container-dashboard">
        <aside className="Sidebar">
          <nav className="SideNav">
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("CompanyInfo_users")}
                className="SideNavLink"
              >
                All Company Users
              </button>
            </li>
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("all_tasks")}
                className="SideNavLink"
              >
                All Tasks
              </button>
            </li>
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("add_user")}
                className="SideNavLink"
              >
                Invite User
              </button>
            </li>
            <li className="SideNavItem">
              <button
                onClick={() => setCompView("add_task")}
                className="SideNavLink"
              >
                Add Task
              </button>
            </li>
          </nav>
        </aside>
        {CompanyInfo ? (
          <main className="OneCompanyDetailActionComp">
            <h1 className="CompanyName">{CompanyInfo?.name}</h1>
            {CompView === "CompanyInfo_users" && (
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
          </main>
        ) : (
          <div>
            <p>Hello</p>
            <Link to="/all-dashboard">Back to Dashboard</Link>
          </div>
        )}
      </div>
    );
  }
}

export default OneCompanyDetails;
