import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

function AdminRegisterUser() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BaseURL = "http://127.0.0.1:8000/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== password2) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BaseURL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          first_name,
          last_name,
          password,
          password2,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        alert("Successfully Registered!");
        console.log(data);
        setLoading(false);
        navigate("/all-dashboard");
      } else {
        setError(data.detail);
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <main className="reginsidecont">
        <h1>Register New User</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <button type="submit">{loading ? "Loading..." : "Register"}</button>
        </form>
        {error && <p>{error}</p>}
      </main>
    </div>
  );
}

export default AdminRegisterUser;
