namespace SimpleSocialAppBackend.Models.Post
{
  public class LikePostDTO
  {
      public Guid PostId { get; set; }
      public Guid UserId { get; set; }
  }
}