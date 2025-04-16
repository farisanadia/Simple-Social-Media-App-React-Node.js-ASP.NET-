import { React, useEffect, useState } from "react";

// handles a single post object of 
// author, content, id, timestamp, userid
const PostComponent = ({ post, user }) => {
  const [newContent, setNewContent] = useState(post.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19);
    fetch("/api/posts/updatePost", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: post.id,
        content: newContent,
        timestamp: timestamp
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Post updated:", data);
        setIsEditing(false);
        // Ideally you'd refresh the post list without full reload
        window.location.reload();
      })
      .catch(err => console.error("Error:", err));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    fetch("/api/posts/deletePost", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: post.id,
      })
    }) 
    .then(() => {
      console.log("Post deleted");
      setNewContent("");
      setIsEditing(false);
      window.location.reload();
    })
    .catch(err => console.error("Error:", err));
  }


  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={handleEditToggle}>Cancel</button>
        </form>
      ) : (
        <>
          <p>{post.content}</p>
          {user.id == post.userId ? (
              <div>
                <button onClick={handleEditToggle}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
          ) : (
            <></>
          )}

        </>
      )}
    </div>
  );
};

export default PostComponent;
