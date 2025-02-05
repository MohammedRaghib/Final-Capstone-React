import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OneCompanyDetails from "./OneCompanyDetails.jsx";
import './styles/overalladmin.css'

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
    <div className="OverallAdminDashboardCont">
      <h1 className="AdminTitle">Admin View</h1>
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
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="CompanyNameTd">
                <Link to={`/company`} state={{ company }}>
                  {company.name}
                </Link>
              </td>
              <td className="CompanyAdminTd">{company.admin_name}</td>
              <td className="CompanyUserCountTd">{company.users.length}</td>
              <td className="CompanyInvitedTd">{company.invited_users.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OverallAdmin;
