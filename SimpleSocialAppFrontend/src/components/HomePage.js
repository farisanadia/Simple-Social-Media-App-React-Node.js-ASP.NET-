import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import CreatePost from "./CreatePost";

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
        console.log(err.message);
      })
  }, [])


  return (
    <div style={{ width: "100%" }}>
      <CreatePost setPosts={setPosts} />
      {posts ? 
      (
        <div>
        {posts.map((post) => (
          <PostComponent key={post.id} post={post} user={user} setPosts={setPosts} />
        ))}
        </div>
      ) : (
        <h2> no posts </h2>
      )}
    </div>
  )
}

export default HomePage;