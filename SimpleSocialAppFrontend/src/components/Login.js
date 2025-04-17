import React, { useState } from "react";
import { toast } from 'react-toastify'; 

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
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        setUser({ id: data.id, username: data.username, password: data.password });
        setLoginUser("");
        setLoginPassword("")
        toast.success("Logged in successfully!")
      } else {
        const err = await res.json();
        if (res.status == 401) {
          toast.error("Invalid username or password given.");
        } else {
          toast.error(err.message || "An unexpected error occurred.");
        }
      }
    })
    .catch((err) => {
      console.error("Error logging in:", err);
      toast.error("A network error occured. Please try again.")
    });
  };

  return (
    <form onSubmit={login} className="flex-form">
      <h2>Login</h2>
      <input
        type="text"
        value={loginUser}
        onChange={(e) => setLoginUser(e.target.value)}
        placeholder="Username"
        className="input-field"
        required
      />
      <input
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        placeholder="Password"
        className="input-field"
        required
      />
      <input type="submit" value="Submit" className="submit-btn"/>
    </form>
  );
}

export default Login;
