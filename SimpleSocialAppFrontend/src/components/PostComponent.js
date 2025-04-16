import { useEffect, useState, React } from "react";

const PostComponent = () => {
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
  }, []);

  return (
    <div className="post-printer">
      <h2>Posts</h2>
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
  );
};

export default PostComponent;
