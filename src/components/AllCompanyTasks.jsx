import React, { useState } from "react";
import "./styles/admindash.css";
import "./styles/modal.css";

const AllCompanyTasks = ({
  CompanyInfo,
  updateTaskStatus,
  DeleteTask,
  addComment,
  newCommentText,
  setNewCommentText,
  CompanyUsers,
  setTaskForm,
  setEditingTaskId,
  assignedUsers,
  setAssignedUsers,
  handleView,
}) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignedUsers, setCurrentAssignedUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [FilteredTasks, setFilteredTasks] = useState([]);

  const all_users = CompanyInfo.users;
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

  const handleFilter = () => {
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
    setFilteredTasks(filteredTasks);
  };

  const handleOpenModal = (assignedUserIds) => {
    console.log("Assigned User IDs: ", assignedUserIds);
    const assignedUserObjects = assignedUserIds.map((userId) => {
      const user = all_users.find((user) => user.id === userId);
      if (!user) {
        console.warn(`User not found for ID ${userId}`);
      }
      return user || { id: userId, username: "Unknown" };
    });
    setCurrentAssignedUsers(assignedUserObjects);
    setIsModalOpen(true);
  };

  console.log("Current Assigned Users: ", all_users, currentAssignedUsers);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserSearchQuery("");
  };

  const filteredUsers = currentAssignedUsers.filter((user) =>
    user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <section className="TaskCompany">
      <div className="Filters">
        <div className="searchAndfilter">
          <input
            type="text"
            placeholder="Search tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleFilter} className="FilterButton">
            Filter
          </button>
        </div>
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
          filteredTasks.map((task) => (
            <li key={task.id} className="Task">
              <div className="TaskCont">
                <h3 className="TaskTitle">{task.title}</h3>
                <p className="TaskDesc">{task.description}</p>
                <code className="TaskDueDate">Due date: {task.due_date}</code>
                <br />
                <br />
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className="select"
                >
                  <option value="TODO">To do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
                <br />
                <br />
                <button
                  className="EditTaskButton"
                  onClick={() => {
                    setTaskForm({
                      taskTitle: task.title,
                      taskDescription: task.description,
                      dueDate: task.due_date,
                    });
                    setEditingTaskId(task.id);
                    const assignedUserObjects = task.assigned_to.map(
                      (userId) =>
                        all_users.find((user) => user.id === userId) || {
                          id: userId,
                          username: "Unknown",
                        }
                    );
                    setAssignedUsers(assignedUserObjects);
                    handleView("add_task");
                  }}
                >
                  Edit Task
                </button>
                <button
                  className="DeleteTaskBtn"
                  onClick={() => DeleteTask(task.id)}
                >
                  Delete Task
                </button>
                <button
                  className="ViewAssignedUsersBtn"
                  onClick={() => handleOpenModal(task.assigned_to)}
                >
                  View Assigned Users
                </button>
                <details className="AllComments">
                  <summary className="CommentsLabel">Comments:</summary>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="AddComment"
                  />
                  <button
                    onClick={() => addComment(task.id, newCommentText)}
                    className="AddCommentBtn"
                  >
                    Add Comment
                  </button>
                  <article className="TaskComments">
                    {task?.comments.length > 0 ? (
                      task.comments.map((comment) => (
                        <div key={comment.id} className="Comment">
                          <span className="CommentUser">{comment.user}</span>
                          <p className="CommentContent">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p>No comments available</p>
                    )}
                  </article>
                </details>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks added</p>
        )}
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Assigned Users</h2>
            <input
              type="text"
              placeholder="Search users"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="search-input"
            />
            <ul>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <li key={user.id}>{user.username}</li>
                ))
              ) : (
                <li>No users found</li>
              )}
            </ul>
            <button onClick={handleCloseModal} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AllCompanyTasks;
