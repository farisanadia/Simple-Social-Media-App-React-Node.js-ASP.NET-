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
        public IActionResult CreateUser([FromBody] User newUser)
        {
            Console.Write("creating user");
            try
            {
                var createdUser = _userService.Create(newUser);
                return Ok(createdUser); // returns json
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message }); // returns json
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
