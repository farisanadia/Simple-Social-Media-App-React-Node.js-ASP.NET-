namespace SimpleSocialAppBackend.Models
{
    public class Post
    {
        public Guid Id { get; set; }
        public string Author { get; set; } = string.Empty;
        public Guid UserId { get; set;}
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        // if parentId is null, it is a post. Else it is a comment
        public Guid? ParentId { get; set; }
        public List<Post> Replies { get; set; } = new List<Post>();
    }
}
