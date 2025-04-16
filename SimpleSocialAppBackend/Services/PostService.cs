using SimpleSocialAppBackend.Models;
using System.Text.Json;

namespace SimpleSocialAppBackend.Services
{
    public class PostService
    {
        private readonly string _filePath = "Data/posts.json";
        private List<Post> _posts;

        public PostService()
        {
            if (!File.Exists(_filePath))
                File.WriteAllText(_filePath, "[]");

            var json = File.ReadAllText(_filePath);
            _posts = JsonSerializer.Deserialize<List<Post>>(json) ?? new List<Post>();
        }

        public List<Post> GetAll() => _posts;

        public List<Post> Create(Post post)
        {
          if (_posts.Any(p => p.Id == post.Id))
            throw new Exception("Error creating post, duplicate id submitted");
          _posts.Add(post);
          SaveToFile();
          return _posts;
        }

        public Comment CreateComment(Comment comment)
        {
            var postToComment = _posts.FirstOrDefault(p => comment.PostId.Equals(p.Id));
            if (postToComment != null)
            {
                postToComment.Comments.Add(comment);
                SaveToFile();
                return comment;
            }            
            else
            {
                throw new Exception("Comment not found.");
            }
        }

        public Post? Delete(Guid postId)
        {
            Console.Write(postId);
            var postToDelete = _posts.FirstOrDefault(p => postId.Equals(p.Id));
            if (postToDelete != null)
            {
                _posts.Remove(postToDelete);
                SaveToFile();
            }
            return postToDelete;
        }

         private void SaveToFile()
        {
            string json = JsonSerializer.Serialize(_posts, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }

        public List<Post> GetUserPosts(Guid userId)
        {
            return _posts.Where(p => p.UserId == userId).ToList();
        }

        public void DeleteByUserId(Guid userId)
        {
            _posts.RemoveAll(p => p.UserId == userId);
            SaveToFile();
        }

        public Post? GetById(Guid id)
        {
            return _posts.FirstOrDefault(p => id.Equals(p.Id));
        }

        public void Update(Post post)
        {
            Console.Write(post);
            var index = _posts.FindIndex(p => p.Id == post.Id);
            if (index != -1)
            {
                _posts[index] = post;
                SaveToFile(); // Persist the changes
            }
            else
            {
                throw new Exception("Post not found.");
            }
        }
    }
}
