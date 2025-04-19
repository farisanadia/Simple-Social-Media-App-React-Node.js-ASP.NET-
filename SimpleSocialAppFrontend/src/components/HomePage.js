import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import CreatePost from "./CreatePost";
import { toast } from 'react-toastify'; 

const HomePage = ({user}) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPosts(data);
      })
      .catch((err) => {
        toast.error("Error retrieving posts: " + err.message);
      })
  }, [])


  return (
    <div style={{ width: "100%" }}>
      <CreatePost setPosts={setPosts} />
      {posts.length > 0 ? 
      (
        <div>
        {posts.map((post) => (
          <PostComponent key={post.id} post={post} user={user} setPosts={setPosts} />
        ))}
        </div>
      ) : (
        <h2 style={{ color: "#00408C" }}> No recent activity :( </h2>
      )}
    </div>
  )
}

export default HomePage;