import React, { useEffect, useState } from "react";
import "./styles/createcomp.css";
import { useNavigate } from "react-router-dom";
import { use } from "react";

const CreatePersonal = ({ userInfo }) => {
  const [personalName, setPersonalName] = useState("");
  const BaseURL = import.meta.env.VITE_BaseURL;
  const [personalInfo, setPersonalInfo] = useState({});
  const [personalInfoFetched, setPersonalInfoFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState("");

  const fetchPersonal = async () => {
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
      console.log("Personal data:", data);
      setPersonalInfo(data.personal || {});
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BaseURL}create-personal/${userInfo?.user?.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.access}`,
          },
          body: JSON.stringify({ name: personalName, admin: admin }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Personal data:", data);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error creating personal:", error);
    }
    if (userInfo?.user?.is_superuser) {
      navigate("/all-dashboard");
    } else {
      navigate("/personal-dashboard");
    }
  };
  const fetchUsersForAdmin = async () => {
    try {
      const response = await fetch(
        `${BaseURL}getusersforadmin/?search=${searchQuery}&model=personal`,
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
    fetchPersonal();
  }, [BaseURL, userInfo]);

  useEffect(() => {
    fetchUsersForAdmin();
  }, [searchQuery]);
  return (
    <div className="CreatePersonalCont">
      {(isEmpty(personalInfo) || userInfo?.user?.is_superuser) && (
        <>
          <h2 className="AdminTitle">Create Personal</h2>
          <form
            onSubmit={handlePersonalSubmit}
            className="CreatePersonalForm"
            id="personalForm"
          >
            <input
              type="text"
              placeholder="Personal Name"
              value={personalName}
              onChange={(e) => setPersonalName(e.target.value)}
              required
            />
            <button type="submit" name="Public" className="CreatePersonalButton">
              Create
            </button>
          </form>
          {userInfo?.user?.is_superuser && (
            <section className="AdminSection">
              <h2 className="AdminTitle">Select Admin For Personal Account</h2>
              <input
                type="text"
                placeholder="Search Users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="SearchBar"
              />
              <section className="UserList">
                {users.map((user) => (
                  <li key={user.id} className="UserItem">
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
        </>
      )}
      {!isEmpty(personalInfo) && !userInfo?.user?.is_superuser && (
        <section className="ElseContainer">
          <p className="AlreadyInCompany">You are already have an account</p>
          <a href="/personal-dashboard">Back to personal dashboard</a>
        </section>
      )}
    </div>
  );
};
export default CreatePersonal;
