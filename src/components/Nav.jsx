import React from "react";
import "./styles/nav.css";

function Nav({ userInfo, setUserInfo }) {
  const BaseURL = import.meta.env.VITE_PhotoUrl;

  const handleLogOut = async () => {
    try {
      const response = await fetch(`${BaseURL}/api/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: userInfo.refresh }),
      });
      setUserInfo(null);
      const remove_info = localStorage.removeItem("userInfo");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <nav className="Navbar">
        <section className="ProfAndDashboard">
          <li className="Navitem">
            <a className="Navlink" href="/">
              <img
                alt="Profile Picture"
                src={
                  userInfo?.user.profile_picture
                    ? `${BaseURL}${userInfo.user.profile_picture}`
                    : "https://generated-images.perchance.org/image/379575b777c491789998467c91d4740cb9f75efb04e66b4568dbae5e9b982762.jpeg"
                }
                width={50}
                height={50}
              />
            </a>
          </li>
          {!userInfo?.user?.is_superuser && (
            <li className="Navitem">
              <a className="Navlink" href="/all-dashboard">
                Company Dashboard
              </a>
            </li>
          )}
          <li className="Navitem">
            <a className="Navlink" href="/personal-dashboard">
              {!userInfo?.user?.is_superuser
                ? "Personal Dashboard"
                : "Dashboard"}
            </a>
          </li>
          {userInfo?.user?.is_superuser && (
            <li className="Navitem">
              <a className="Navlink" href="/create-company">
                Create Company
              </a>
            </li>
          )}
          {userInfo?.user?.is_superuser && (
            <li className="Navitem">
              <a className="Navlink" href="/create-personal">
                Create Personal
              </a>
            </li>
          )}
        </section>
        <section className="NewUserAndLogout">
          {userInfo?.user?.is_superuser && (
            <li className="Navitem">
              <a className="Navlink" href="/register-user">
                Register New User
              </a>
            </li>
          )}
          <li className="Navitem">
            <a className="Navlink" onClick={handleLogOut}>
              Logout
            </a>
          </li>
        </section>
      </nav>
    </>
  );
}

export default Nav;
