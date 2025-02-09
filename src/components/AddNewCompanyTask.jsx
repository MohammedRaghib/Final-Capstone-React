import React from "react";

const AddNewCompanyTask = ({
  handleFormSubmit,
  TaskForm,
  handleChange,
  CompanyInfo,
  assignedUsers,
  setAssignedUsers,
  editingTaskId,
}) => {
  return (
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
        <h4>Assign to Users</h4>
        <aside className="AllUsersToAssign">
          {CompanyInfo?.users?.length > 0 ? (
            CompanyInfo?.users?.map((user) => (
              <div key={user.id} className="CheckBoxUser">
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
                <span className="Assignee">{user.username}</span>
              </div>
            ))
          ) : (
            <p>No users in company</p>
          )}
        </aside>
        <input
          type="submit"
          value={editingTaskId ? "Update Task" : "Add Task"}
        />
      </form>
    </section>
  );
};

export default AddNewCompanyTask;
