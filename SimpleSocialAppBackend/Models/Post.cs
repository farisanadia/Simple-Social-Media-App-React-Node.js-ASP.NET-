namespace SimpleSocialAppBackend.Models
{
    public class Post
    {
        public Guid Id { get; set; }
        public string Author { get; set; } = string.Empty;
        public Guid UserId { get; set;}
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
