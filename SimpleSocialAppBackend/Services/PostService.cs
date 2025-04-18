using SimpleSocialAppBackend.Models.Post;
using System.Text.Json;

namespace SimpleSocialAppBackend.Services
{
    public class PostService
    {
        private readonly string _filePath = "Data/posts.json";
        private List<PostDTO> _posts;

        public PostService()
        {
            if (!File.Exists(_filePath))
                File.WriteAllText(_filePath, "[]");

            var json = File.ReadAllText(_filePath);
            _posts = JsonSerializer.Deserialize<List<PostDTO>>(json) ?? new List<PostDTO>();
        }

        public List<PostDTO> GetAll() => GetAllNested();

        public List<PostDTO> Create(PostDTO post)
        {
            if (_posts.Any(p => p.Id == post.Id))
                throw new Exception("Error creating post, duplicate id submitted");

            if (post.ParentId != null && !_posts.Any(p => p.Id == post.ParentId))
                throw new Exception("Parent post not found.");

            _posts.Add(post);
            SaveToFile();

            return GetAllNested();
        }

        private PostDTO ClonePost(PostDTO post)
        {
            return new PostDTO
            {
                Id = post.Id,
                Author = post.Author,
                Content = post.Content,
                Timestamp = post.Timestamp,
                Likes = post.Likes,
                UserId = post.UserId,
                ParentId = post.ParentId,
                Replies = new List<PostDTO>()
            };
        }

        private List<PostDTO> GetAllNested()
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

        public PostDTO? Delete(Guid postId)
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

        private void DeleteRepliesRecursive(PostDTO post)
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

        public List<PostDTO> GetUserPosts(Guid userId)
        {
            foreach (var post in _posts)
                post.Replies = new List<PostDTO>();

            var lookup = _posts.ToLookup(p => p.ParentId);

            void PopulateReplies(PostDTO post)
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

        public PostDTO? GetById(Guid id)
        {
            return _posts.FirstOrDefault(p => p.Id == id);
        }

        public void Update(PostDTO post)
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

        public void Like(Guid postId, Guid userId)
        {
            var post = _posts.FirstOrDefault(p => p.Id == postId);
            if (post!=null)
            {
                post.Likes.Add(userId);
                SaveToFile();
            } else {
                throw new Exception("Post not found");
            }
        }

        public void Dislike(Guid postId, Guid userId)
        {
            var post = _posts.FirstOrDefault(p => p.Id == postId);
            if (post!=null)
            {
                post.Likes.Remove(userId);
                SaveToFile();
            } else {
                throw new Exception("Post not found");
            }
        }

        public void RemoveLikesByUserId(Guid userId)
        {
            foreach (var post in _posts)
            {
                // Remove the userId from the Likes list if it exists
                post.Likes.Remove(userId);
            }

            SaveToFile();
        }
    }
}
