import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";

const Login = ({ setUserInfo, userInfo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BaseURL = import.meta.env.VITE_BaseURL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        navigate("/");
      } else {
        setError(data.detail);
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };
  console.log("TaskPlan#2025!*");
  useEffect(() => {
    const wakeUpBackend = async () => {
      await fetch(BaseURL);
    };
    wakeUpBackend();
  }, []);
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
              <button type="submit">{loading ? "Loading..." : "Login"}</button>
            </form>
            {error && <p>{error}</p>}
            <p>
              Dont have an account? <a href="/register">Register</a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Login;
