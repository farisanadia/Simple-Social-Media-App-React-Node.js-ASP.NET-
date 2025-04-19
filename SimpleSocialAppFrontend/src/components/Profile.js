import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [posts, setPosts] = useState([]);
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
    <>
      {user && user.username && <Header user={user} setUser={setUser} />}
      <main style={{ padding: "2rem 0rem", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "auto" }}>
        <div style={{ width: "40%", minWidth: "500px" }}>
        <h2 style={{ color: "#00408C" }}>Your Posts:</h2>
        {posts ? 
          (
            <div>
            {posts.map((post) => (
              <PostComponent key={post.id} post={post} user={user}/>
            ))}
            </div>

          ) : (
            <h2> no posts </h2>
        )}
        </div>
      </main>
    </>
  )
}
export default Profile;