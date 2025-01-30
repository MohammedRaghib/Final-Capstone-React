import React from "react";

const AddNewCompanyTask = ({
  handleFormSubmit,
  TaskForm,
  handleChange,
  CompanyUsers,
  assignedUsers,
  setAssignedUsers,
  editingTaskId,
}) => {
  return (
    <section className="AddingCompanyTask">
      <h3 className="AddTaskTitle">Add Task</h3>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={TaskForm.taskTitle}
          name="taskTitle"
          onChange={handleChange}
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
        />
        <h4>Assign to Users</h4>
        {CompanyUsers.map((user) => (
          <div key={user.id}>
            <input
              type="checkbox"
              value={user.id}
              checked={assignedUsers.some((u) => u.id === user.id)}
              onChange={(e) => {
                setAssignedUsers(
                  e.target.checked
                    ? [...assignedUsers, user]
                    : assignedUsers.filter((u) => u.id !== user.id)
                );
              }}
            />
            {user.username}
          </div>
        ))}
        <input
          type="submit"
          value={editingTaskId ? "Update Task" : "Add Task"}
        />
      </form>
    </section>
  );
};

export default AddNewCompanyTask;
