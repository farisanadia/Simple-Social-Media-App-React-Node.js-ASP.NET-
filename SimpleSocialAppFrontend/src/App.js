import React, { useEffect, useState } from "react";
import CreatePost from "./components/CreatePost";
import { Link } from "react-router-dom";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import HomePage from "./components/HomePage";

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setUser(userObj);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser({});
  };

  const deleteAccount = () => {
    fetch("/api/users/deleteUser", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    })
      .then(() => {
        localStorage.clear();
        setUser({});
      })
      .catch((err) => console.error("Error deleting account:", err));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Simple Social App</h1>
      {user.username ? (
        <div>
          <Link to="/profile">{user.username}</Link>
          <CreatePost />
          <HomePage user={user}/>
          <button onClick={deleteAccount}>Delete Account</button>
          <button onClick={logout}>Log Out</button>
        </div>
      ) : (
        <div>
          <Login setUser={setUser} />
          <CreateAccount setUser={setUser} />
        </div>
      )}
    </div>
  );
}

export default App;
