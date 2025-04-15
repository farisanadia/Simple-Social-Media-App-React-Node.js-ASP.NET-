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
        <>
        {posts.map((post) => (
          <>
            <li>{post.author} {post.content} {post.timestamp}</li>
          </>
        ))}
        </>
      ) : (
        <h2> no posts </h2>
      )}
    </div>
  );
};

export default PostComponent;
