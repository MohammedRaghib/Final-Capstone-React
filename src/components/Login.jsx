import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/login.css'

const Login = ({ setUserInfo, userInfo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BaseURL = "http://127.0.0.1:8000/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BaseURL}api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setUserInfo(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/create-company");
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("An error occurred");
    }
  };
  
  console.log('TaskPlan#2025!*')
  return (
    <div className="login-container">
      <main className="logininsidecont">
      {userInfo ? (
        <div className="AlreadyLoggedin">
          <p>You are already logged in</p>
          <a href="/">Home</a>
        </div>
      ) : (
        <div className="LoginView">
          <h1>Login</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          {error && <p>{error}</p>}
        </div>
      )}
      </main>
    </div>
  );
};

export default Login;
