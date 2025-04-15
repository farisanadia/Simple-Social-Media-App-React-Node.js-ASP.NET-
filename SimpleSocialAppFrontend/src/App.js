import React, { useEffect, useState } from "react";
import PostComponent from "./components/PostComponent";
import CreatePost from "./components/CreatePost";
import { Link } from "react-router-dom";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    console.log("User state updated: ", user);
    if (user) {
      console.log(user['id']);
    }
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      console.log("Loaded from localStorage:", userObj);
      setUser(userObj);
    }
  }, []);

  const createAccount = (event) => {
    event.preventDefault();
    const user = {
      username: username,
      password: password,
    }

    fetch("/api/users/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        localStorage.setItem("user", JSON.stringify(data));
        setUser({ id: data.id, username: data.username, password: data.password });
        setUsername("");
        setPassword("");
      })
      .catch(err => console.error("Error:", err));
  };

  const deleteAccount = (e) => {
    e.preventDefault();
    console.log(user.id)
    fetch("/api/users/deleteUser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({id: user.id})
    })
    .then(res => {
      console.log(res);
      localStorage.clear();
      setUser({});
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Simple Social App</h1>
      {user && user.username ? (      
        <div>
          <Link to="/profile">{user.username}</Link>
          <CreatePost />
          <PostComponent/>
          <button onClick={deleteAccount}>Delete Account</button>
        </div>
      ) : 
      <>
      <form onSubmit={createAccount}>
        <h4>Login/Create Account</h4>
        <label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </label>
        <label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </label>
        <input type="submit"/>
      </form>
      </>
    }

    </div>
  );
}

export default App;