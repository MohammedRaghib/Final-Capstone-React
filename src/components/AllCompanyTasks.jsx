import React, { useState } from "react";
import "./styles/admindash.css";

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

  const filteredTasks = CompanyInfo.tasks.filter((task) => {
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const [startDate, endDate] = getDateRange(dateFilter);
    const taskDueDate = normalizeDate(new Date(task.due_date));
    const matchesDateRange =
      (!startDate || taskDueDate >= startDate) &&
      (!endDate || taskDueDate <= endDate);
    const matchesSearchQuery =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDateRange && matchesSearchQuery;
  });

  return (
    <section className="TaskCompany">
      <div className="Filters">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="select"
        >
          <option value="">All Dates</option>
          <option value="TODAY">Today</option>
          <option value="TOMORROW">Tomorrow</option>
          <option value="NEXT_WEEK">Next Week</option>
          <option value="AFTER_NEXT_WEEK">After Next Week</option>
        </select>
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
                        CompanyUsers.find((user) => user.id == userId) || {
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
    </section>
  );
};

export default AllCompanyTasks;
