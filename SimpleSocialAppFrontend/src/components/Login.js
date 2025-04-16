import React, { useState } from "react";

function Login({ setUser }) {
  const [loginUser, setLoginUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const login = (e) => {
    e.preventDefault();
    const user = {
      username: loginUser,
      password: loginPassword,
    }

    fetch("/api/users/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("user", JSON.stringify(data));
      setUser({ id: data.id, username: data.username, password: data.password });
      setLoginUser("");
      setLoginPassword("")
    })
    .catch((err) => console.error("Error logging in:", err));
  };

  return (
    <form onSubmit={login}>
      <h4>Login</h4>
      <label>
        Username:
        <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
      </label>
      <input type="submit" value="Log In" />
    </form>
  );
}

export default Login;
