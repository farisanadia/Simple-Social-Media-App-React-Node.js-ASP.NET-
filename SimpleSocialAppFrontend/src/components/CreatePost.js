// CreatePost.js
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from 'react-toastify'; 

const CreatePost = ({setPosts}) => {
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
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
          setContents("");
          toast.success("Post uploaded successfully.")
        } else {
          toast.error(err.message || "An unexpected error occured.")
        }
      })
      .catch(err => {
        console.error("Error:", err);
        toast.error("A network error occured. Please try again.")
      });

  };

  return (
    <div>
      <form onSubmit={createPost}>
        <div style={{ display: "flex", gap: "0.5rem", width: "100%", maxWidth: "600px" }}>
          <FaRegUserCircle style={{ padding: "0rem 0rem 0rem 0.5rem", fontSize: "2.5rem", color: "#00408C" }}/>
          <textarea placeholder="What's happening?" className="post-textarea" value={contents} onChange={(e) => setContents(e.target.value)} rows="5"/>
        </div>
        <div className="align-right">
          <button className="submit-post" type="submit">Post</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
