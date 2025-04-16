import React, { useState } from "react";

function CreateAccount({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = (event) => {
    event.preventDefault();
    const user = { username, password };

    fetch("/api/users/createUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setUser({ id: data.id, username: data.username });
        setUsername("");
        setPassword("");
      })
      .catch((err) => console.error("Error creating account:", err));
  };

  return (
    <form onSubmit={createAccount}>
      <h4>Create Account</h4>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <input type="submit" value="Create Account" />
    </form>
  );
}

export default CreateAccount;
