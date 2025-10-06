import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
    const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append("password", formData.password);
    if (file) fd.append("image", file);
    console.log("Form Data:", formData);
    axios
      .post("http://localhost:2000/api/auth/register", fd ,{
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        swal({
          title: "Welcome back!",
          text: "You logged in successfully ✅",
          icon: "success",
        }).then(() => {
          navigate("/login ");
        });
      })
      .catch((error) => console.log(error));
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f3f4f6, #d1d5db)",
  };

  const cardStyle = {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    marginBottom: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    fontWeight: "500",
    color: "#333",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4F46E5",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  };

  const footerStyle = {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2
          style={{ textAlign: "center", marginBottom: "20px", color: "#111" }}
        >
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
                    <div>
            <label style={labelStyle}>Profile Picture</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
        </form>

        <p style={footerStyle}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#4F46E5", textDecoration: "none" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
