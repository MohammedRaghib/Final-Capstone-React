import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import CreateCompany from "./components/CreateCompany";
import Homepage from "./components/Homepage";
import Nav from "./components/Nav";
import OverallAdmin from "./components/OverallAdmin";
import OneCompanyDetails from "./components/OneCompanyDetails";
import Profile from "./components/Profile";
import CreatePersonal from "./components/CreatePersonal";
import PersonalDashboard from "./components/PersonalDashboard";
import OnePersonalDetails from "./components/OnePersonalDetails";
import AdminRegisterUser from "./components/AdminRegisterUser";

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
          <Route
            path="/"
            element={
              userInfo ? (
                <Profile userInfo={userInfo} setUserInfo={setUserInfo} />
              ) : (
                <Login setUserInfo={setUserInfo} userInfo={userInfo} />
              )
            }
          />
          <Route
            path="/login"
            element={
              !userInfo ? (
                <Login setUserInfo={setUserInfo} userInfo={userInfo} />
              ) : (
                <AdminDashboard userInfo={userInfo} setUserInfo={setUserInfo} />
              )
            }
          />
          <Route
            path="/register"
            element={
              !userInfo ? (
                <Register setUserInfo={setUserInfo} />
              ) : (
                <AdminDashboard userInfo={userInfo} setUserInfo={setUserInfo} />
              )
            }
          />
          <Route
            path="/register-user"
            element={
              userInfo ? (
                userInfo.user.is_superuser ? (
                  <AdminRegisterUser userInfo={userInfo} />
                ) : (
                  <Login userInfo={userInfo} setUserInfo={setUserInfo} />
                )
              ) : (
                <Login setUserInfo={setUserInfo} />
              )
            }
          />
          <Route
            path="/all-dashboard"
            element={
              userInfo ? (
                userInfo.user.is_superuser ? (
                  <OverallAdmin userInfo={userInfo} />
                ) : (
                  <AdminDashboard
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                  />
                )
              ) : (
                <Login setUserInfo={setUserInfo} />
              )
            }
          />
          <Route
            path="/personal-dashboard"
            element={
              userInfo ? (
                userInfo.user.is_superuser ? (
                  <OverallAdmin userInfo={userInfo} />
                ) : (
                  <PersonalDashboard
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                  />
                )
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
          <Route
            path="/create-personal"
            element={
              userInfo ? (
                <CreatePersonal userInfo={userInfo} />
              ) : (
                <Login setUserInfo={setUserInfo} />
              )
            }
          />
          <Route
            path="/company"
            element={
              userInfo ? (
                userInfo.user.is_superuser ? (
                  <OneCompanyDetails userInfo={userInfo} />
                ) : (
                  <CreateCompany userInfo={userInfo} />
                )
              ) : (
                <Login setUserInfo={setUserInfo} />
              )
            }
          />
          <Route
            path="/personal"
            element={
              userInfo ? (
                userInfo.user.is_superuser ? (
                  <OnePersonalDetails userInfo={userInfo} />
                ) : (
                  <CreatePersonal userInfo={userInfo} />
                )
              ) : (
                <Login setUserInfo={setUserInfo} />
              )
            }
          />
          <Route
            path="/profile"
            element={
              userInfo ? (
                <Profile userInfo={userInfo} />
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
