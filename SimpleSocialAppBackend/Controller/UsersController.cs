using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using SimpleSocialAppBackend.Models;
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

        public class DeleteUserRequest
        {
            public Guid Id { get; set; }
        }

        // IActionResult appropriate when multiple ActionResult types are 
        // possible in an action.
        [HttpPost("createUser")]
        public IActionResult CreateUser([FromBody] RegisterUser user)
        {
            Console.Write("creating user");
            try
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
                var newUser = new User
                {
                    Username = user.Username,
                    PasswordHash = hashedPassword
                };
                var createdUser = _userService.Create(newUser);
                return Ok(new { username = newUser.Username, id = newUser.Id }); // returns json
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message }); // returns json
            }
        }

        [HttpPost("loginUser")]
        public IActionResult LoginUser([FromBody] RegisterUser user)
        {
            Console.Write("logging in");
            try {
                var existingUser = _userService.GetByUsername(user.Username);
                if (existingUser == null)
                {
                    return Unauthorized(new { message = "User not found"} );
                }

                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(user.Password, existingUser.PasswordHash);
                if (!isPasswordValid)
                {
                    return Unauthorized(new { message = "Invalid password"} );
                }
                return Ok(new { username = existingUser.Username, id = existingUser.Id });

            } 
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("deleteUser")]
        public IActionResult DeleteUser([FromBody] DeleteUserRequest request)
        {
          Console.Write("deleting user");
          Console.Write(request.Id);
          _userService.Delete(request.Id);
          return NoContent();
        }

    }
}
