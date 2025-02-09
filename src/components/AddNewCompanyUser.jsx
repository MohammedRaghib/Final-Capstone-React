import React from "react";

const AddNewCompanyUser = ({
  FilteredUsers,
  searchQuery,
  setSearchQuery,
  InviteUser,
}) => {
  return (
    <section className="AddUser">
      <span>Search Users to invite: </span>
      <br />
      <input
        type="text"
        placeholder="Search for users"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {FilteredUsers?.length > 0 ? (
        <ul className="AllUsers">
          {FilteredUsers?.map((user) => (
            <li key={user.id} className="RandomUser">
              <span className="RanUsername">{user.username}</span>
              <button onClick={(e) => InviteUser(e)} value={user.id}>
                Invite
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </section>
  );
};

export default AddNewCompanyUser;
