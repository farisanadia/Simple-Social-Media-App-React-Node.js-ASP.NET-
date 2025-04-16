import { useEffect, useState } from "react";

function Profile() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});

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

  useEffect(() => {
    if (user && user.id) {
      console.log("Fetching posts for:", user.id);
      fetch(`/api/posts/getUserPosts?id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setPosts(data);
        })
        .catch(err => console.error("Error:", err));
    }
  }, [user]);

  return (
    <div style={{ padding: "2rem" }}>
    <h2>profile</h2>
    {posts ? 
      (
        <div>
        {posts.map((post) => (
          <li key={post.id}>{post.author} {post.content} {post.timestamp}</li>
        ))}
        </div>
      ) : (
        <h2> no posts </h2>
    )}
    </div>
  )
}
export default Profile;