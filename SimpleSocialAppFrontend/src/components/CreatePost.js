import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from 'react-toastify'; 

const MAX_CHAR = 200;

const CreatePost = ({ setPosts }) => {
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
  }, [navigate]);

  const createPost = (e) => {
    e.preventDefault();

    const trimmedContent = contents.trim();
    if (trimmedContent.length === 0) {
      toast.error("Post cannot be empty.");
      return;
    }

    if (trimmedContent.length > MAX_CHAR) {
      toast.error(`Post cannot exceed ${MAX_CHAR} characters.`);
      return;
    }

    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19);
    const uuid = uuidv4();
    const post = {
      id: uuid,
      author: user.username,
      userId: user.id,
      content: trimmedContent,
      timestamp: timestamp
    };

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
          toast.success("Post uploaded successfully.");
        } else {
          const err = await res.json();
          toast.error(err.message || "An unexpected error occurred.");
        }
      })
      .catch(err => {
        console.error("Error:", err);
        toast.error("A network error occurred. Please try again.");
      });
  };

  return (
    <div>
      <form onSubmit={createPost}>
        <div style={{ display: "flex", gap: "0.5rem", width: "100%", maxWidth: "600px", position: "relative" }}>
          <FaRegUserCircle style={{ padding: "0rem 0rem 0rem 0.5rem", fontSize: "2.5rem", color: "#00408C" }} />
          <div style={{ flexGrow: 1, position: "relative" }}>
            <textarea
              placeholder="What's happening?"
              className="post-textarea"
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              rows="5"
              style={{ width: "100%", boxSizing: "border-box", paddingBottom: "1.5rem" }}
            />
            <div style={{
              position: "absolute",
              bottom: "0.3rem",
              right: "0.5rem",
              fontSize: "0.8rem",
              color: contents.length > MAX_CHAR ? "red" : "gray"
            }}>
              {contents.length}/{MAX_CHAR}
            </div>
          </div>
        </div>
        <div className="align-right">
          <button className="submit-post" type="submit">Post</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

