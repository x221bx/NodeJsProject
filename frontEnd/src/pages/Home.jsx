import React, { useEffect, useState } from "react";
import Posts from "../components/post.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { apiUrl } from "../config/api";

export const Home = () => {
  const [user, setUser] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get(apiUrl("/api/users/me"), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handelLogout = () => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        localStorage.removeItem("token");
        swal("You have been logged out successfully ✅", {
          icon: "success",
        }).then(() => navigate("/login"));
      } else {
        swal("Logout canceled 🚫");
      }
    });
  };

  if (!token) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      <header className="w-full bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
            📝 My Blog
          </h1>
          <div className="flex gap-5">
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">
                {user?.name || "Guest"}
              </span>
              <img
                src={user.imageUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full shadow"
              />
            </div>
            <button
              style={{ cursor: "pointer" }}
              className="bg-blue-500 px-5 text-white rounded-2xl hover:bg-blue-700  transition"
              onClick={() => handelLogout()}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Posts user={user} token={token} />
      </main>

      <footer className="mt-10 py-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} My Blog. All rights reserved.
      </footer>
    </div>
  );
};
