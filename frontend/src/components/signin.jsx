import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signin", { email, password });
      if (res.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/chat");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Backend error");
    }
  };

  return (
    <div className="container">
         <div className="logo-text">AURA</div>

      <h2>Welcome Back to AURA</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
        <button type="submit" className="signin">Sign In</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}