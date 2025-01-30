import React from "react";

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
  return (
    <section className="TaskCompany">
      {CompanyInfo?.tasks?.length > 0 ? (
        CompanyInfo.tasks.map((task) => (
          <li key={task.id} className="Task">
            <h3 className="TaskTitle">{task.title}</h3>
            <p className="TaskDesc">{task.description}</p>
            <code className="TaskDueDate">{task.due_date}</code>
            <select
              value={task.status}
              onChange={(e) => updateTaskStatus(task.id, e.target.value)}
            >
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
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
              />
              <button onClick={() => addComment(task.id, newCommentText)}>
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
          </li>
        ))
      ) : (
        <p>No tasks added</p>
      )}
    </section>
  );
};

export default AllCompanyTasks;
