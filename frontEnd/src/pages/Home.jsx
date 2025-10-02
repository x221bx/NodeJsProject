import React, { useEffect, useState } from 'react'
import Posts from '../components/post.jsx'
import axios from 'axios';

export const Home = () => {
   const [user, setUser] = useState([])
   const token = localStorage.getItem('token')

    useEffect(() => {
    axios
      .get("http://localhost:3000/api/users/me", {
        headers:{Authorization:`Bearer ${token}`}
      })
      .then((res) => {
        setUser(res)

      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div>
      <Posts user={user} token={token}/>
    </div>
  )
}
