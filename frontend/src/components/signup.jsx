import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signup", { fullName, email, password });
      if (res.data.success) navigate("/");
      else alert("Error creating account");
    } catch (err) {
      alert("Backend error");
    }
  };

  return (
    <div className="container">

         <div className="logo-text">AURA</div>

      <h2>Create Your AURA Account</h2>
      <form onSubmit={handleSignUp}>
        <input type="text" placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} required/>
        <input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <button type="submit" className="signup">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/">Sign In</Link></p>
    </div>
  );
}