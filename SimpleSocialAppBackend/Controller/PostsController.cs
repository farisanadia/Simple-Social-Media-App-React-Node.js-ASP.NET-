using Microsoft.AspNetCore.Mvc;
using SimpleSocialAppBackend.Models;
using SimpleSocialAppBackend.Services;

namespace SimpleSocialAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : Controller
    {
        private readonly PostService _postService;

       public PostsController(PostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public ActionResult<List<Post>> GetAll()
        {
            return _postService.GetAll();
        }

        [HttpPost("createPost")]
        public IActionResult createPost([FromBody] Post post)
        {
          Console.Write("uploading post");
          try
          {
            var createdPost = _postService.Create(post);
            return Ok(createdPost);
          }
          catch (Exception ex)
          {
            return BadRequest(new { message = ex.Message });
          }
        }

        [HttpGet("getUserPosts")]
        public ActionResult<List<Post>> getUserPosts([FromQuery] string id)
        {
          var posts = _postService.GetUserPosts(id);
          return Ok(posts);
        }
    }
}
