namespace SimpleSocialAppBackend.Models.User
{
    public class UserRequestDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Username { get; set; } = string.Empty;
    }
}
