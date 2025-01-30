import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import CreateCompany from "./components/CreateCompany";
import Homepage from "./components/HomePage";
import Nav from "./components/Nav";

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const savedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    setUserInfo(savedUserInfo);
  }, []);

  return (
    <>
      {userInfo && <Nav userInfo={userInfo} setUserInfo={setUserInfo} />}
      <Router>
        <Routes>
          <Route path="/" element={<Homepage userInfo={userInfo} />} />
          <Route
            path="/login"
            element={<Login setUserInfo={setUserInfo} userInfo={userInfo} />}
          />
          <Route
            path="/register"
            element={<Register setUserInfo={setUserInfo} />}
          />
          <Route
            path="/all-dashboard"
            element={
              userInfo ? (
                <AdminDashboard userInfo={userInfo} />
              ) : (
                <Login setUserInfo={setUserInfo} />
              )
            }
          />
          <Route
            path="/create-company"
            element={
              userInfo ? (
                <CreateCompany userInfo={userInfo} />
              ) : (
                <Login setUserInfo={setUserInfo} />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
