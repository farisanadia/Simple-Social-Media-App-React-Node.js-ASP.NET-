namespace SimpleSocialAppBackend.Models.Post
{
    public class PostDTO
    {
        public Guid Id { get; set; }
        public string Author { get; set; } = string.Empty;
        public Guid UserId { get; set;}
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public List<Guid> Likes { get; set; } = new List<Guid>();
        // if parentId is null, it is a post. Else it is a comment
        public Guid? ParentId { get; set; }
        public List<PostDTO> Replies { get; set; } = new List<PostDTO>();
    }
}
