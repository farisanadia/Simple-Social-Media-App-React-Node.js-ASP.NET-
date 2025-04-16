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
    }
}
