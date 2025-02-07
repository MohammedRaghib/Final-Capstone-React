import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/overalladmin.css";

function OverallAdmin({ userInfo }) {
  const [companies, setCompanies] = useState([]);
  const [Personals, setPersonals] = useState([]);
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
        console.log("Companies and personals data:", data);
        setCompanies(data.companies);
        return data.personals || [];
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        console.log("Done");
      }
    };
    const set = async () => {
      const data = await fetchCompanies();
      setPersonals(data);
    };
    set();
  }, [BaseURL, userInfo.access]);
  return (
    <div className="OverallAdminDashboardCont">
      <h1 className="OverallAdminDashboardTitle">All Companies</h1>
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
          {companies.length > 0 ? (
            companies.map((company) => (
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
                <td className="CompanyUserCountTd">{company.users.length}</td>
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
      <h1 className="OverallAdminDashboardTitle">All Personals</h1>
      <table border="1" className="AllCompaniesTable">
        <thead className="TableHeader">
          <tr>
            <th className="CompanyNameTh">Personal Name</th>
            <th className="CompanyAdminTh">Admin</th>
          </tr>
        </thead>
        <tbody className="TableBody">
          {Personals.length > 0 ? (
            Personals.map((personal) => (
              <tr key={personal.id}>
                <td className="CompanyNameTd">
                  <Link to="/personal" 
                    state={{ personal: personal }}
                    className="CompanyLink">
                    {personal.name}
                  </Link>
                </td>
                <td className="CompanyAdminTd">{personal.admin.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="NotFound" colSpan={4}>
                No personals found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OverallAdmin;
