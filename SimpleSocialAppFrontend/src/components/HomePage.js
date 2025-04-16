import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";

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
    <div className="post-printer">
      <h2>Posts</h2>
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
  )
}

export default HomePage;