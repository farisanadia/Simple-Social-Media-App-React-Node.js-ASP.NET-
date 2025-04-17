import React, { useState } from "react";
import { toast } from 'react-toastify'; 

function CreateAccount({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const createAccount = (event) => {
    event.preventDefault();

    // simple complexity check for username and password
    const usernameValid = username.length >= 3;
    const passwordValid = /^(?=.*[A-Za-z])[A-Za-z\d]{6,}$/.test(password);

    if (!usernameValid) {
      toast.error("Username must be at least 3 characters long.");
      return;
    }

    if (!passwordValid) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== checkPassword) {
      toast.error("Your passwords do not match.");
      return;
    }
    const user = { username, password };
 
    fetch("/api/users/createUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("user", JSON.stringify(data));
          setUser({ id: data.id, username: data.username });
          setUsername("");
          setPassword("");
          setCheckPassword("");
          toast.success("Account created successfully!");
        } else {
          const err = await res.json();
          if (res.status === 409) {
            toast.error("Username already exists.");
          } else {
            toast.error(err.message || "An unexpected error occurred.");
          }
        }
      })
      .catch((err) => {
        console.error("Error creating account:", err);
        toast.error("A network error occurred. Please try again.");
      });
  };

  return (
    <form onSubmit={createAccount} className="flex-form">
      <h2>Sign Up</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="input-field"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="input-field"
        required
      />
      <input
        type="password"
        value={checkPassword}
        onChange={(e) => setCheckPassword(e.target.value)}
        placeholder="Repeat Password"
        className="input-field"
        required
      />
      <input type="submit" value="Submit" className="submit-btn" />
    </form>
  );
}

export default CreateAccount;
