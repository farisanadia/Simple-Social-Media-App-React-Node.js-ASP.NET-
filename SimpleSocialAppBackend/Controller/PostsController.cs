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
        public ActionResult<List<Post>> getUserPosts([FromQuery] Guid id)
        {
          var posts = _postService.GetUserPosts(id);
          return Ok(posts);
        }


        [HttpPut("updatePost")]
        public ActionResult<Post> updatePost([FromBody] UpdatePost updatedPost)
        {
          Console.Write("updating post");
          Console.Write(updatedPost.Id);
          var existingPost = _postService.GetById(updatedPost.Id);
          if (existingPost == null)
          {
            return NotFound(new { message = "Post not found." });
          }
          existingPost.Content = updatedPost.Content;
          existingPost.Timestamp = updatedPost.Timestamp;
          _postService.Update(existingPost);
          return Ok(existingPost);
        }
    }
}
