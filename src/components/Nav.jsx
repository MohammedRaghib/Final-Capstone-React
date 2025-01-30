import React from "react";
import  './styles/nav.css';

function Nav({ userInfo, setUserInfo }) {
  const BaseURL = "http://127.0.0.1:8000/";

  const handleLogOut = async () => {
    try {
      const response = await fetch(`${BaseURL}api/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({refresh: userInfo.refresh}),
      });
      setUserInfo(null);
      const remove_info = localStorage.removeItem("userInfo");
    } catch (e) {
      console.error(e)
    }
  };
  return (
    <>
      <nav className="Navbar">
        <li className="Navitem">
          <a className="Navlink" onClick={handleLogOut}>
            Logout
          </a>
        </li>
        <li className="Navitem">
          <a className="Navlink" href="/all-dashboard">
            Dashboard
          </a>
        </li>
      </nav>
    </>
  );
}

export default Nav;
