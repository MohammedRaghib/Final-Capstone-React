import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/createcomp.css'

const CreateCompany = ({ userInfo }) => {
  const [companyName, setCompanyName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [company, setCompany] = useState();
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({});
  const [companyInfoFetched, setCompanyInfoFetched] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BaseURL = "http://127.0.0.1:8000/";

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${BaseURL}usercompanies/`, {
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
        },
      });
      if (!response.ok) {
        console.error('Error')
    }
      const data = await response.json();
      console.log("Companies data:", data);
      setCompany(data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    if (company && !companyInfoFetched) {
      const firstCompany = company;
      if (firstCompany.id) {
        try {
          const response = await fetch(
            `${BaseURL}companies/${firstCompany.id}/`,
            {
              headers: {
                Authorization: `Bearer ${userInfo.access}`,
              },
            }
          );
          const data = await response.json();
          setCompanyInfo(data);
          setCompanyInfoFetched(true);
          console.log("CompanyInfo:", data);
        } catch (error) {
          console.error("Error fetching company info:", error);
        }
      }
    }
  };
  const getNotifications = async () => {
    const userId = userInfo?.user.id;
    try {
      setLoading(true);
      const response = await fetch(`${BaseURL}notifications/${userId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error inviting user");
      }

      const data = await response.json();
      console.log(data.detail);
      console.table(data.notifications);
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed getting notifications.", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BaseURL}companies/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
        body: JSON.stringify({ name: companyName }),
      });

      const data = await response.json();
      if (response.status === 201) {
        navigate("/admin-dashboard");
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("An error occurred");
    }
  };
  const acceptOrDeclineInvite = async (companyid, method) => {
    const url = `${BaseURL}accept_or_decline_invite/${userInfo?.user.id}/${companyid}/`;
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to process the request.");
      }

      const data = await response.json();
      console.log(data);

      if (method === "POST") {
        console.log("User added to the company");
      } else if (method === "DELETE") {
        console.log("Company offer declined");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [BaseURL, userInfo]);

  useEffect(() => {
    fetchCompanyInfo();
    getNotifications();
  }, [company, companyInfoFetched, userInfo]);

  if (loading) {
    return (
      <div className="loader-cont">
        <div className="loader">
          <div className="wrapper">
            <div className="circle"></div>
            <div className="line-1"></div>
            <div className="line-2"></div>
            <div className="line-3"></div>
            <div className="line-4"></div>
          </div>
        </div>
      </div>
    );
  } else if (company) {
    return (
      <section className="ElseContainer">
        <p className="AlreadyInCompany">You are already joined in a company</p>
        <a href="/all-dashboard">Back to company dashboard</a>
      </section>
    );
  } else {
    return (
      <div className="CreateCompanyCont">
        <h2 className="CreateCompanyTitle">Create Company</h2>
        <form onSubmit={handleSubmit} className="CreateCompanyForm">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <button type="submit">Create</button>
        </form>
        <section className="InvitesCont">
          {notifications?.map((notification) => {
            return (
              <div className="NotificationCont" key={notification.created_at}>
                <p className="NotificationCompany">
                  {notification?.company?.name} has invited you to join the company
                </p>
                <button onClick={()=> (acceptOrDeclineInvite(notification.company.id, 'POST'))}>Accept invite</button>
                <button onClick={()=> (acceptOrDeclineInvite(notification.company.id, 'DELETE'))}>Decline invite</button>
              </div>
            );
          })}
        </section>
        {error && <p className="Error">{error}</p>}
      </div>
    );
  }
};

export default CreateCompany;
