namespace SimpleSocialAppBackend.Models
{
    public class Post
    {
        public String Id { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public Guid UserId { get; set;}
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
