import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/overalladmin.css";

function OverallAdmin({ userInfo }) {
  const [companies, setCompanies] = useState([]);
  const [personals, setPersonals] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filteredPersonals, setFilteredPersonals] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchCompanies, setSearchCompanies] = useState("");
  const [searchPersonals, setSearchPersonals] = useState("");
  const [Users, setUsers] = useState([]);
  const [CompView, setCompView] = useState("companies");
  const BaseURL = "http://127.0.0.1:8000/";

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${BaseURL}overalladmin/allcompanies/`, {
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
          },
        });
        const data = await response.json();
        setCompanies(data.companies);
        setFilteredCompanies(data.companies);
        return data.personals || [];
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        console.log("Done");
      }
    };
    const fetchPersonals = async () => {
      const data = await fetchCompanies();
      setPersonals(data);
      setFilteredPersonals(data);
    };
    fetchPersonals();
  }, [BaseURL, userInfo.access]);

  const handleSearch = async (e) => {
    const { name, value } = e.target;
    if (name === "companies") {
      setSearchCompanies(value);
      const filtered = companies.filter((company) =>
        company.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setSearchPersonals(value);
      const filtered = personals.filter((personal) =>
        personal.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPersonals(filtered);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BaseURL}allunfilteredusers/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.access}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Error fetching users");
        }
        const data = await response.json();
        setUsers(data.all_users);
        setFilteredUsers(data.all_users);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsers();
  }, [BaseURL, userInfo.access]);

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${BaseURL}allunfilteredusers/${userId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error deleting user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    location.reload();
  };

  const handleSearchUsers = async (e) => {
    const { value } = e.target;
    const filtered = Users.filter(
      (user) =>
        user.email.toLowerCase().includes(value.toLowerCase()) ||
        user.first_name.toLowerCase().includes(value.toLowerCase()) ||
        user.last_name.toLowerCase().includes(value.toLowerCase()) ||
        user.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  const handleView = (view) => {
    setCompView(view);
  };
  return (
    <div className="container-dashboard">
      <aside className="Sidebar">
        <nav className="SideNav">
          <li className="SideNavItem" onClick={() => handleView("companies")}>
            <button className="SideNavLink">All Companies</button>
          </li>
          <li className="SideNavItem">
            <button
              className="SideNavLink"
              onClick={() => handleView("personals")}
            >
              All Personals
            </button>
          </li>
          <li className="SideNavItem">
            <button
              className="SideNavLink"
              onClick={() => handleView("users")}
            >
              All Users
            </button>
          </li>
        </nav>
      </aside>
      <div className="OverallAdminDashboardCont">
        {CompView === "companies" && (
          <div className="companies">
            <h1 className="OverallAdminDashboardTitle">All Companies</h1>
            <input
              type="text"
              name="companies"
              value={searchCompanies}
              onChange={handleSearch}
              placeholder="Search Companies..."
            />
            <br />
            <table border="1" className="AllCompaniesTable">
              <thead className="TableHeader">
                <tr>
                  <th className="CompanyNameTh">Company Name</th>
                  <th className="CompanyAdminTh">Admin</th>
                  <th className="CompanyUserCountTh">User Count</th>
                  <th className="CompanyInvitedTh">Invited Users Count</th>
                </tr>
              </thead>
              <tbody className="TableBody">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <tr key={company.id}>
                      <td className="CompanyNameTd">
                        <Link
                          to={`/company`}
                          state={{ company: company }}
                          className="CompanyLink"
                        >
                          {company.name}
                        </Link>
                      </td>
                      <td className="CompanyAdminTd">{company.admin_name}</td>
                      <td className="CompanyUserCountTd">
                        {company.users.length}
                      </td>
                      <td className="CompanyInvitedTd">
                        {company.invited_users.length}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="NotFound" colSpan={4}>
                      No companies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {CompView === "personals" && (
          <div className="personals">
            <h1 className="OverallAdminDashboardTitle">All Personals</h1>
            <input
              type="text"
              name="personals"
              value={searchPersonals}
              onChange={handleSearch}
              placeholder="Search Personals..."
            />
            <br />
            <table border="1" className="AllPersonalsTable">
              <thead className="TableHeader">
                <tr>
                  <th className="CompanyNameTh">Personal Name</th>
                  <th className="CompanyAdminTh">Admin</th>
                </tr>
              </thead>
              <tbody className="TableBody">
                {filteredPersonals.length > 0 ? (
                  filteredPersonals.map((personal) => (
                    <tr key={personal.id}>
                      <td className="CompanyNameTd">
                        <Link
                          to="/personal"
                          state={{ personal: personal }}
                          className="CompanyLink"
                        >
                          {personal.name}
                        </Link>
                      </td>
                      <td className="CompanyAdminTd">{personal.admin.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="NotFound" colSpan={2}>
                      No personals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {CompView === "users" && (<div className="users">
          <h1 className="OverallAdminDashboardTitle">All Users</h1>
          <input
            type="text"
            name="users"
            onChange={handleSearchUsers}
            placeholder="Search Users..."
          />
          <br />
          <table border="1" className="AllUsersTable">
            <thead className="TableHeader">
              <tr>
                <th className="UserEmailTh">Email</th>
                <th className="UserFirstNameTh">First Name</th>
                <th className="UserLastNameTh">Last Name</th>
                <th className="UserNameTh">Username</th>
                <th className="UserActionsTh">Actions</th>
              </tr>
            </thead>
            <tbody className="TableBody">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="UserEmailTd">{user.email}</td>
                    <td className="UserFirstNameTd">{user.first_name}</td>
                    <td className="UserLastNameTd">{user.last_name}</td>
                    <td className="UserNameTd">{user.username}</td>
                    <td className="UserActionsTd">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="DelUser"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="NotFound" colSpan={5}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>)}
      </div>
    </div>
  );
}

export default OverallAdmin;
