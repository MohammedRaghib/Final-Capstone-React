import React from "react";

const AllCompanyUsers = ({
  CompanyInfo,
  CompanyUsers,
  removeUserFromCompany,
}) => {
  return (
    <section className="CompanyUsers">
      <h2 className="CompanyUsersTitle">Company Users:</h2>
      <main className="CompanyUserContOnly">
        {CompanyInfo?.users?.length > 0 ? (
          CompanyInfo?.users.map((user) => {
            return (
              <li key={user.id} className="CompanyUser">
                <h2 className="CompanyUsername">{user.username}</h2>
                <button
                  className="RemoveUserButton"
                  onClick={async () => {
                    const confirmRemoval = window.confirm(
                      `Are you sure you want to remove ${user.username}?`
                    );
                    if (confirmRemoval) {
                      await removeUserFromCompany(user.id);
                    }
                  }}
                >
                  Remove
                </button>
              </li>
            );
          })
        ) : (
          <p>No users available</p>
        )}
      </main>
    </section>
  );
};

export default AllCompanyUsers;
