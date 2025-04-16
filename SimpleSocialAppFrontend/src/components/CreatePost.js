// CreatePost.js
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const CreatePost = () => {
  const [contents, setContents] = useState("");
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      console.log("Loaded from localStorage:", userObj);
      setUser(userObj);
    } else {
      navigate('/');
    }
  }, []);

  const createPost = (e) => {
    e.preventDefault();
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19);
    const uuid = uuidv4();
    const post = {
      id: uuid,
      author: user.username,
      userId: user.id,
      content: contents,
      timestamp: timestamp
    }

    fetch("/api/posts/createPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(post)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        window.location.reload();
      })
      .catch(err => console.error("Error:", err));

  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={createPost}>
        <label>
          <input type="text" value={contents} onChange={(e) => setContents(e.target.value)}/>
        </label>
        <input type="submit"/>
      </form>
    </div>
  );
};

export default CreatePost;
