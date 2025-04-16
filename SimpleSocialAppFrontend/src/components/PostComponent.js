import { React, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
// handles a single post object of 
// author, content, id, timestamp, userid
const PostComponent = ({ post, user }) => {
  const [newContent, setNewContent] = useState(post.content);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCommentToggle = () => {
    setIsCommenting(!isCommenting);
  }

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
        window.location.reload();
      })
      .catch(err => console.error("Error:", err));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19);
    const uuid = uuidv4();

    fetch("/api/posts/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: uuid,
        author: user.username,
        userId: user.id,
        content: newComment,
        timestamp: timestamp,
        postId: post.id
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Comment Created:", data);
        setIsCommenting(false);
        window.location.reload();
      })
      .catch(err => console.error("Error:", err));
  }

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
        <div>
          <form onSubmit={handleEditSubmit}>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={handleEditToggle}>Cancel</button>
          </form>
        </div>
      ) : (
        <>
          <p>{post.content}</p>
          {post.comments ? (
            post.comments.map((comment, index) => (
              <div key={index}>{comment.author}{comment.content}{comment.timestamp}</div>
            ))
          ) 
          : (
            <></>
          )} 
          {user.id == post.userId ? (
              <div>
                <button onClick={handleEditToggle}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
          ) : (
            <></>
          )}
          {isCommenting ? (
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <button type="submit">Send</button>
              <button type="button" onClick={handleCommentToggle}>Cancel</button>
            </form>
          ) : (
            <button type="button" onClick={handleCommentToggle}>Comment</button>
          )}

        </>
      )}
    </div>
  );
};

export default PostComponent;
