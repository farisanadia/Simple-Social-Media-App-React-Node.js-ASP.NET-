import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const PostComponent = ({ post, user, level = 0 }) => {
  const [newContent, setNewContent] = useState(post.content);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCommentToggle = () => {
    setIsCommenting(!isCommenting);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
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
    const timestamp = new Date().toISOString();
    const uuid = uuidv4();

    fetch("/api/posts/createPost", {
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
        parentId: post.id
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Comment Created:", data);
      setNewComment("");
      setIsCommenting(false);
      window.location.reload();
    })
    .catch(err => console.error("Error:", err));
  };

  const handleSubmitLike = (e) => {
    e.preventDefault();
    console.log(post)
    let isLiked = false;
    if (post.likes) { isLiked = post.likes.includes(user.id); 
      console.log("Reached")
     };

    fetch(`/api/posts/${isLiked ? 'dislikePost' : 'likePost'}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postId: post.id,
        userId: user.id
      })
    })
    .then(() => {
      console.log("like submitted");
      window.location.reload();
    })
    .catch(err => console.error("Error liking post:", err));
  }

  const handleDelete = (e) => {
    e.preventDefault();
    fetch("/api/posts/deletePost", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: post.id
      })
    })
    .then(() => {
      console.log("Post deleted");
      setNewContent("");
      setIsEditing(false);
      window.location.reload();
    })
    .catch(err => console.error("Error:", err));
  };

  return (
    <div style={{ marginLeft: `${level * 20}px`, borderLeft: '1px solid #ccc', paddingLeft: '10px', marginTop: '10px' }}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
          />
          <div>
            <button type="submit">Save</button>
            <button type="button" onClick={handleEditToggle}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <p><strong>{post.author}</strong>: {post.content}</p>
          <p><small>{new Date(post.timestamp).toLocaleString()}</small></p>
          <p>{post.likes?.length || 0} {post.likes?.length === 1 ? "like" : "likes"}</p>

          {user.id === post.userId && (
            <div>
              <button onClick={handleEditToggle}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}

          {isCommenting ? (
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
              />
              <div>
                <button type="submit">Send</button>
                <button type="button" onClick={handleCommentToggle}>Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <button onClick={handleCommentToggle}>Reply</button>
              <button onClick={handleSubmitLike}>
                {post.likes?.includes(user.id) ? "Dislike" : "Like"}
              </button>
            </div>
          )}
        </>
      )}

      {Array.isArray(post.replies) && post.replies.length > 0 && (
        <div className="replies">
          {post.replies.map((reply) => (
            <PostComponent key={reply.id} post={reply} user={user} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostComponent;
