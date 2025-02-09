import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/createcomp.css";

const CreateCompany = ({ userInfo }) => {
  const [companyName, setCompanyName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({});
  const [companyInfoFetched, setCompanyInfoFetched] = useState(false);
  const [admin, setAdmin] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
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
        console.error("Error");
      }
      const data = await response.json();
      console.log("Companies data:", data);
      setCompany(data.company || {});
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
          setCompanyInfo(data.company || {});
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
        body: JSON.stringify({ name: companyName, admin: admin }),
      });

      const data = await response.json();
      if (response.status === 201) {
        navigate("/all-dashboard");
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
    location.reload();
  };
  const fetchUsersForAdmin = async () => {
    try {
      const response = await fetch(
        `${BaseURL}getusersforadmin/?search=${searchQuery}&model=company`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.access}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.detail);
        return [];
      }
      const data = await response.json();
      console.log("Users fetched:", data.all_users);
      setUsers(data.all_users);
      return data.all_users;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleUserSelect = (user) => {
    setAdmin(user.id);
    console.log("Selected admin:", user.username);
  };
  const isEmpty = (obj) => {
    if (obj == null) {
      return true;
    }
    return Object.keys(obj).length === 0;
  };

  useEffect(() => {
    fetchCompanies();
  }, [BaseURL, userInfo]);

  useEffect(() => {
    fetchCompanyInfo();
    getNotifications();
  }, [company, companyInfoFetched, userInfo]);

  useEffect(() => {
    fetchUsersForAdmin();
  }, [searchQuery]);

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
  } else if (!isEmpty(company) && !userInfo?.user?.is_superuser) {
    return (
      <section className="ElseContainer">
        <p className="AlreadyInCompany">You are already joined in a company</p>
        <a href="/all-dashboard">Back to company dashboard</a>
      </section>
    );
  } else if (isEmpty(company) || userInfo?.user?.is_superuser) {
    return (
      <div className="CreateCompanyCont">
        <h2 className="AdminTitle">Create Company</h2>
        <form
          onSubmit={handleSubmit}
          className="CreateCompanyForm"
          id="companyForm"
        >
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <button type="submit" name="Public" className="CreateCompanyButton">
            Create
          </button>
        </form>
        {userInfo?.user?.is_superuser && (
            <section className="AdminSection">
              <h2 className="AdminTitle">Select Admin For Company</h2>
              <input
                type="text"
                placeholder="Search Users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="SearchBar"
              />
              <section className="UserList">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="UserItem"
                    style={{ display: "flex" }}
                  >
                    <input
                      type="radio"
                      name="admin"
                      value={user.id}
                      onChange={() => handleUserSelect(user)}
                    />
                    <label>{user.username}</label>
                  </li>
                ))}
              </section>
            </section>
          )}
        {error && <p className="Error">{error}</p>}
      </div>
    );
  }
};

export default CreateCompany;
