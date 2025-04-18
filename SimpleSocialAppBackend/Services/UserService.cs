using SimpleSocialAppBackend.Models.User;
using System.Text.Json;

namespace SimpleSocialAppBackend.Services
{
    public class UserService
    {
        private readonly string filePath = "Data/users.json";
        private List<UserProfileDTO> users;
        private readonly PostService _postService;

        public UserService(PostService postService)
        {
            _postService = postService;
            if (File.Exists(filePath))
            {
                string json = File.ReadAllText(filePath);
                users = JsonSerializer.Deserialize<List<UserProfileDTO>>(json) ?? new List<UserProfileDTO>();
            }
            else
            {
                users = new List<UserProfileDTO>();
            }
        }

        public UserProfileDTO Create(UserProfileDTO user)
        {
            if (users.Any(u => u.Username == user.Username))
                throw new Exception("Username already taken.");

            users.Add(user);
            SaveToFile();
            return user;
        }

        private void SaveToFile()
        {
            string json = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(filePath, json);
        }

        public UserProfileDTO? Delete(Guid id)
        {   
            Console.Write(id);
            var userToDelete = users.FirstOrDefault(u => id.Equals(u.Id));
            Console.Write(userToDelete);
            if (userToDelete != null)
            {
                users.Remove(userToDelete);
                Console.Write(userToDelete);
                _postService.DeleteByUserId(id);
                _postService.RemoveLikesByUserId(id);  
                SaveToFile();
            }

            return userToDelete;
        }

        public UserProfileDTO? GetByUsername(string username)
        {
            return users.FirstOrDefault(u => u.Username == username);
       }
    }
}
