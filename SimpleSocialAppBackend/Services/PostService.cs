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

        public List<Post> GetAll() => GetAllNested();

        public List<Post> Create(Post post)
        {
            if (_posts.Any(p => p.Id == post.Id))
                throw new Exception("Error creating post, duplicate id submitted");

            if (post.ParentId != null && !_posts.Any(p => p.Id == post.ParentId))
                throw new Exception("Parent post not found.");

            _posts.Add(post);
            SaveToFile();

            return GetAllNested();
        }

        private Post ClonePost(Post post)
        {
            return new Post
            {
                Id = post.Id,
                Author = post.Author,
                Content = post.Content,
                Timestamp = post.Timestamp,
                UserId = post.UserId,
                ParentId = post.ParentId,
                Replies = new List<Post>()
            };
        }

        private List<Post> GetAllNested()
        {
            var clonedPosts = _posts.Select(ClonePost).ToList();
            var lookup = clonedPosts.ToLookup(p => p.ParentId);
            var postById = clonedPosts.ToDictionary(p => p.Id);

            foreach (var post in clonedPosts)
            {
                if (post.ParentId != null && postById.ContainsKey((Guid)post.ParentId))
                {
                    postById[(Guid)post.ParentId].Replies.Add(post);
                }
            }

            return clonedPosts.Where(p => p.ParentId == null).ToList();
        }

        public Post? Delete(Guid postId)
        {
            var postToDelete = _posts.FirstOrDefault(p => p.Id == postId);
            if (postToDelete != null)
            {
                DeleteRepliesRecursive(postToDelete);
                _posts.Remove(postToDelete);
                SaveToFile();
            }

            return postToDelete;
        }

        private void DeleteRepliesRecursive(Post post)
        {
            var replies = _posts.Where(p => p.ParentId == post.Id).ToList();

            foreach (var reply in replies)
            {
                DeleteRepliesRecursive(reply);
                _posts.Remove(reply);
            }
        }

        private void SaveToFile()
        {
            string json = JsonSerializer.Serialize(_posts, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }

        public List<Post> GetUserPosts(Guid userId)
        {
            foreach (var post in _posts)
                post.Replies = new List<Post>();

            var lookup = _posts.ToLookup(p => p.ParentId);

            void PopulateReplies(Post post)
            {
                foreach (var reply in lookup[post.Id])
                {
                    post.Replies.Add(reply);
                    PopulateReplies(reply);
                }
            }

            var topLevelPosts = _posts
                .Where(p => p.UserId == userId && p.ParentId == null)
                .ToList();

            foreach (var post in topLevelPosts)
                PopulateReplies(post);

            return topLevelPosts;
        }

        public void DeleteByUserId(Guid userId)
        {
            _posts.RemoveAll(p => p.UserId == userId);
            SaveToFile();
        }

        public Post? GetById(Guid id)
        {
            return _posts.FirstOrDefault(p => p.Id == id);
        }

        public void Update(Post post)
        {
            var index = _posts.FindIndex(p => p.Id == post.Id);
            if (index != -1)
            {
                _posts[index] = post;
                SaveToFile();
            }
            else
            {
                throw new Exception("Post not found.");
            }
        }
    }
}
