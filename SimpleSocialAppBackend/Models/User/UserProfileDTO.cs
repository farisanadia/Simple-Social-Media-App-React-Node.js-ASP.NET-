namespace SimpleSocialAppBackend.Models.User
{
    public class UserProfileDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
    }
}
