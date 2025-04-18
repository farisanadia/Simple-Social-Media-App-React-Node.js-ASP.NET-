import React, { useEffect, useState } from "react";
import CreatePost from "./components/CreatePost";
import { Link } from "react-router-dom";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import HomePage from "./components/HomePage";
import './App.css';

function App() {
  const [user, setUser] = useState({});
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setUser(userObj);
    }
  }, []);

  const toggleAccountCreation = () => {
    setIsCreatingAccount(!isCreatingAccount);
  }

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
    <main>
      {user && user.username ? (
        <div>
          <Link to="/profile">{user.username}</Link>
          <CreatePost />
          <HomePage user={user}/>
          <button onClick={deleteAccount}>Delete Account</button>
          <button onClick={logout}>Log Out</button>
        </div>
      ) : (
        <div className="acc-component">
          <h1 className="safari-title">SAFARI</h1>
          {isCreatingAccount ? (
            <div className="flex-form">
              <CreateAccount setUser={setUser} />
              <div style={{ display: "flex", alignItems:"center", gap: "0.3rem", paddingBottom: "2rem" }}>
                <p>Already have an account?</p>
                <a className="toggle-btn" onClick={toggleAccountCreation}>Login.</a>
              </div>
            </div>
          ) : (
            <div className="flex-form">
              <Login setUser={setUser} />
              <div style={{ display: "flex", alignItems:"center", gap: "0.3rem", paddingBottom: "2rem" }}>
                <p>Don't have an account?</p>
                <a className="toggle-btn" onClick={toggleAccountCreation}>Sign up.</a>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
