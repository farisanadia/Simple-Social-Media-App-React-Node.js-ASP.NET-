namespace SimpleSocialAppBackend.Models.Post
{
  public class UpdatePostDTO
  {
      public Guid Id { get; set; }
      public string Content { get; set; } = string.Empty;
      public DateTime Timestamp {get; set; }
  }
}