using Microsoft.AspNetCore.Mvc;
using SimpleSocialAppBackend.Models.User;
using SimpleSocialAppBackend.Services;

namespace SimpleSocialAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        // IActionResult appropriate when multiple ActionResult types are 
        // possible in an action.
        [HttpPost("createUser")]
        public ActionResult<UserRequestDTO> CreateUser([FromBody] UserCreationDTO user)
        {
            Console.Write("creating user");
            try
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
                var newUser = new UserProfileDTO
                {
                    Username = user.Username,
                    PasswordHash = hashedPassword
                };
                var createdUser = _userService.Create(newUser);
                return Ok(new { username = newUser.Username, id = newUser.Id }); // returns json
            }
            catch (Exception ex)
            {
                if (ex.Message == "Username already taken.")
                {
                    return Conflict(new { message = ex.Message }); // HTTP 409
                }
                return StatusCode(500, new { message = "Something went wrong while creating the account." });
            }
        }

        [HttpPost("loginUser")]
        public ActionResult<UserRequestDTO> LoginUser([FromBody] UserCreationDTO user)
        {
            Console.Write("logging in");
            try {
                var existingUser = _userService.GetByUsername(user.Username);
                if (existingUser == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(user.Password, existingUser.PasswordHash);
                if (!isPasswordValid)
                {
                    return Unauthorized(new { message = "Invalid password" });
                }
                return Ok(new { username = existingUser.Username, id = existingUser.Id });

            } 
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("deleteUser")]
        public IActionResult DeleteUser([FromBody] UserDeleteDTO request)
        {
          Console.Write("deleting user");
          Console.Write(request.Id);
          var deletedUser = _userService.Delete(request.Id);
          if (deletedUser == null)
          {
            return NotFound(new { message = "User not found."  });
          }
          return NoContent(); // http 204
        }

    }
}
