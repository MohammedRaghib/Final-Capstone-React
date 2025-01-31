import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OneCompanyDetails from "./OneCompanyDetails.jsx";

function OverallAdmin({ userInfo }) {
  const [companies, setCompanies] = useState([]);
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
        console.log("Companies data:", data);
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        console.log("Done");
      }
    };
    fetchCompanies();
  }, [BaseURL, userInfo.access]);

  return (
    <div>
      <h1>Admin Companies</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Admin</th>
            <th>User Count</th>
            <th>Invited Users Count</th>
            <th>Non-Company Users</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>
                <Link to={`/company`} state={{ company }}>
                  {company.name}
                </Link>
              </td>
              <td>{company.admin_name}</td>
              <td>{company.users.length}</td>
              <td>{company.invited_users.length}</td>
              <td>
                <ul>
                  {(company.noncompanyusers || []).map((user) => (
                    <li key={user.id}>{user.username}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Company Tasks</h2>
      {companies.map((company) => (
        <div key={company.id}>
          <h3>{company.name}</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(company.tasks || []).map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <h2>Company Notifications</h2>
      {companies.map((company) => (
        <div key={company.id}>
          <h3>{company.name}</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Notification Message</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {(company.notifications || []).map((notification, index) => (
                <tr key={index}>
                  <td>{notification.message}</td>
                  <td>{notification.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default OverallAdmin;
