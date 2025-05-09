import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FaRegUserCircle } from "react-icons/fa";
import { FaHeart } from 'react-icons/fa';
import { FaReply } from "react-icons/fa6";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from 'react-toastify'; 

const PostComponent = ({ post, user, level = 0, setPosts}) => {
  const [newContent, setNewContent] = useState(post.content);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [localPost, setLocalPost] = useState(post);


  const handleEditToggle = () => {
    console.log(post);
    setIsEditing(!isEditing);
    if (isEditing) {
      setIsCommenting(false);
    }
  };

  const handleCommentToggle = () => {
    setIsCommenting(!isCommenting);
    if (isCommenting) {
      setIsEditing(false);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (newContent.trim() === "" || newContent.length > 2000) {
      toast.error("Content must be between 1 and 2000 characters.");
      return;
    }
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
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        post.timestamp = data.timestamp;
        post.content = data.content;
        setIsEditing(false);
        toast.success("Post edited successfully.")
      } else {
        const err = await res.json();
        toast.error(err.message || "An unexpected error occured.")
      }
    })
    .catch(err => console.error("Error:", err));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "" || newComment.length > 2000) {
      toast.error("Comment must be between 1 and 2000 characters.");
      return;
    }
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
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
        setNewComment("");
        setIsCommenting(false);
        toast.success("Comment uploaded succesfully.")
      } else {
        const err = await res.json();
        toast.error(err.message || "An unexpected error occured.")
      }
    })
    .catch(err => console.error("Error:", err));
  };

  const handleSubmitLike = (e) => {
    e.preventDefault();
    console.log(post)

    let isLiked = false;
    if (localPost.likes) { isLiked = localPost.likes.includes(user.id); 
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
      const updatedLikes = isLiked
        ? localPost.likes.filter(id => id !== user.id)
        : [...(localPost.likes || []), user.id];

      setLocalPost({
        ...localPost,
        likes: updatedLikes
      });
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
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
        setNewContent("");
        setIsEditing(false);
      } else {
        const err = await res.json();
        toast.error(err.message || "An unexpected error occured.")
      }
    })
    .catch(err => console.error("Error:", err));
  };

  return (
    <div style={{ marginLeft: level === 0 ? "0px" : "40px", marginTop: '10px', color: "#00408C" }}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", position: "relative" }}>
          <FaRegUserCircle style={{ fontSize: "2rem" }}/>
          <div style={{ position: "relative", flex: 1 }}>
            <textarea
              className="post-textarea" 
              value={newContent}
              onChange={(e) => {
                if (e.target.value.length <= 2000) setNewContent(e.target.value);
              }}
              rows={3}
            />
            <span style={{ position: "absolute", bottom: "4px", right: "8px", fontSize: "0.75rem", color: "#666" }}>
              {newContent.length}/2000
            </span>
          </div>
        </div>
        <div className="align-right" style={{ gap: "0.5rem" }}>
          <button className="submit-post" type="submit" disabled={newContent.trim() === ""}>Save</button>
          <button className="cancel-post" type="button" onClick={handleEditToggle}>Cancel</button>
        </div>
      </form>      
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "-0.5rem" }}>
            <FaRegUserCircle style={{ fontSize: "2rem" }}/>
            <p><strong>{post.author}</strong>: {post.content}</p>
          </div>
          <p><small>{new Date(post.timestamp).toLocaleString()}</small></p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
            {/* Left-aligned: like and comment */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.1rem" }}>
                <button
                  onClick={handleSubmitLike}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaHeart
                    className={localPost.likes?.includes(user.id) ? "liked" : "post-buttons"}
                  />
                </button>
                <span style={{ fontSize: "1rem" }}>{localPost.likes?.length || 0}</span>
              </div>

              <button
                onClick={handleCommentToggle}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaReply className="post-buttons" />
              </button>
            </div>

            {/* Right-aligned: edit and delete */}
            {user.id === post.userId && (
              <div style={{ display: "flex", gap: "0.3rem" }}>
                <button 
                  onClick={handleEditToggle}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}>
                  <MdOutlineModeEdit className="post-buttons" style={{ fontSize: "1.5rem" }}/>
                </button>
                <button 
                  onClick={handleDelete}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}>
                  <MdDeleteOutline className="post-buttons" style={{ fontSize: "1.5rem" }}/>
                </button>
              </div>
            )}
          </div>
            {isCommenting ? (
              <form onSubmit={handleCommentSubmit}>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", marginTop: "0.5rem", position: "relative" }}>
                  <FaRegUserCircle style={{ fontSize: "2rem" }}/>
                  <div style={{ position: "relative", flex: 1 }}>
                    <textarea
                      className="post-textarea"
                      placeholder="Send a reply." 
                      value={newComment}
                      onChange={(e) => {
                        if (e.target.value.length <= 2000) setNewComment(e.target.value);
                      }}
                      rows={3}
                    />
                    <span style={{ position: "absolute", bottom: "4px", right: "8px", fontSize: "0.75rem", color: "#666" }}>
                      {newComment.length}/2000
                    </span>
                  </div>
                </div>
                <div className="align-right" style={{ gap: "0.5rem" }}>
                  <button className="submit-post" type="submit" disabled={newComment.trim() === ""}>Send</button>
                  <button className="cancel-post" type="button" onClick={handleCommentToggle}>Cancel</button>
                </div>
              </form>
            ) : (
              <></>
            )}
        </>
      )}

      {Array.isArray(post.replies) && post.replies.length > 0 && (
        <div className="replies" style={{ borderLeft: '1px solid #ccc' }}>
          {post.replies.map((reply) => (
            <PostComponent key={reply.id} post={reply} user={user} level={level + 1} setPosts={setPosts} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostComponent;
