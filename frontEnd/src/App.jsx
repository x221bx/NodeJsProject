import { useEffect } from "react";
import './App.css'
import axios from "axios";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users")
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/*" element={<NotFound/>}/>
    </Routes>
    </>
  );
}

export default App;
