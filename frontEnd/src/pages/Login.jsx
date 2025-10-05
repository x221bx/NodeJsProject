import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/auth/login", formData)
      .then((res) => {
        console.log(res.data.token);

        localStorage.setItem("token", res.data.token);
        swal({
          title: "Welcome back!",
          text: "You logged in successfully ✅",
          icon: "success",
        }).then(() => {
          navigate("/");
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Login failed ❌");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f4f6, #d1d5db)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{ textAlign: "center", marginBottom: "20px", color: "#111" }}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              style={{ fontWeight: "500", color: "#333", fontSize: "14px" }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                marginBottom: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
              required
            />
          </div>

          <div>
            <label
              style={{ fontWeight: "500", color: "#333", fontSize: "14px" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                marginBottom: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4F46E5",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Login
          </button>
        </form>

        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ color: "#4F46E5", textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
