import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PersonalDashboard = ({ userInfo }) => {
  const [personal, setCompanies] = useState();
  const [loading, setLoading] = useState(true);
  const [personalInfoFetched, setPersonalInfoFetched] = useState(false);
  const BaseURL = "http://127.0.0.1:8000/";
  const [searchQuery, setSearchQuery] = useState("");
  const [AllUsers, setAllUsers] = useState([]);
  const [PersonalInfo, setPersonalInfo] = useState({});
  const [FilteredUsers, setFilteredUsers] = useState([]);
  const [PersonalUsers, SetPersonalUsers] = useState([]);
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
        setCompanies(data.personals || {});
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (personal && !personalInfoFetched) {
        const firstPersonal = personal;
        if (firstPersonal.id) {
          try {
            const response = await fetch(
              `${BaseURL}companies/${firstPersonal.id}/`,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.access}`,
                },
              }
            );
            const data = await response.json();
            setPersonalInfo(data);
            setPersonalInfoFetched(true);
            console.log("PersonalInfo:", data);
          } catch (error) {
            console.error("Error fetching personal info:", error);
          }
        }
      }
    };
    fetchPersonalInfo();
  }, [personal, personalInfoFetched, userInfo]);

  const DeletePersonal = async () => {
    try {
      const response = await fetch(
        `${BaseURL}create-personal/${userInfo?.user?.id}/`,
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
      const response = await fetch(
        `${BaseURL}companies/${personal?.id}/tasks/`,
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
      !PersonalInfo ||
      !PersonalInfo.nonpersonalusers ||
      !Array.isArray(AllUsers) ||
      !AllUsers
    ) {
      return [];
    }
    const filtered_users = AllUsers
      ? AllUsers.filter((ranuser) =>
          PersonalInfo.nonpersonalusers.some((user) => user.id == ranuser.id)
        )
      : [];
    const invite_filtered_users = filtered_users
      ? filtered_users.filter(
          (ranuser) =>
            !PersonalInfo.invited_users.some((user) => user == ranuser.id)
        )
      : [];

    setFilteredUsers(invite_filtered_users);
    // setFilteredUsers(filtered_users);
  };

  useEffect(() => {
    filterusers();
  }, [PersonalInfo, AllUsers]);

  const personalusers = () => {
    if (!PersonalInfo || !PersonalInfo.users) {
      return [];
    }

    const filtered_users = AllUsers
      ? AllUsers.filter((ranuser) =>
          PersonalInfo.users.some((user) => user.id === ranuser.id)
        )
      : [];
    SetPersonalUsers(filtered_users);
  };

  useEffect(() => {
    personalusers();
  }, [PersonalInfo, AllUsers]);

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
        `${BaseURL}companies/${personal?.id}/tasks/${taskid}/`,
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
        `${BaseURL}companies/${personal?.id}/tasks/${taskid}/`,
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
        `${BaseURL}companies/${personal.id}/tasks/${taskid}/`,
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
  if (isEmpty(personal) && !userInfo?.user?.is_superuser) {
    return (
      <div className="ElseContainer">
        <p>You are not part of any personal.</p>
        <Link to="/create-personal">Create Personal</Link>
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome to your Personal Dashboard</h1>
      <p>
        This is where you can manage your personal information and settings.
      </p>
    </div>
  );
};

export default PersonalDashboard;
