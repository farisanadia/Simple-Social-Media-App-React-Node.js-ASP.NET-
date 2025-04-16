using SimpleSocialAppBackend.Models;
using System.Text.Json;

namespace SimpleSocialAppBackend.Services
{
    public class UserService
    {
        private readonly string filePath = "Data/users.json";
        private List<User> users;
        private readonly PostService _postService;

        public UserService(PostService postService)
        {
            _postService = postService;
            if (File.Exists(filePath))
            {
                string json = File.ReadAllText(filePath);
                users = JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
            }
            else
            {
                users = new List<User>();
            }
        }

        public User Create(User user)
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

        public User? Delete(Guid id)
        {   
            Console.Write(id);
            var userToDelete = users.FirstOrDefault(u => id.Equals(u.Id));
            Console.Write(userToDelete);
            if (userToDelete != null)
            {
                users.Remove(userToDelete);
                Console.Write(userToDelete);
                _postService.DeleteByUserId(id);
                SaveToFile();
            }

            return userToDelete;
        }

        public User? GetByUsername(string username)
        {
            return users.FirstOrDefault(u => u.Username == username);
       }
    }
}
