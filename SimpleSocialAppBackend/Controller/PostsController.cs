using Microsoft.AspNetCore.Mvc;
using SimpleSocialAppBackend.Models.Post;
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
        public ActionResult<List<PostDTO>> GetAll()
        {
            return _postService.GetAll();
        }

        [HttpPost("createPost")]
        public ActionResult<PostDTO> createPost([FromBody] PostDTO post)
        {
          Console.Write("uploading post");
          try
          {
            var createdPost = _postService.Create(post);
            return Ok(createdPost);
          }
          catch (Exception e)
          {
            return BadRequest(new { message = e.Message });
          }
        }


        [HttpGet("getUserPosts")]
        public ActionResult<List<PostDTO>> getUserPosts([FromQuery] Guid id)
        {
          var posts = _postService.GetUserPosts(id);
          return Ok(posts);
        }


        [HttpPut("updatePost")]
        public ActionResult<PostDTO> updatePost([FromBody] UpdatePostDTO updatedPost)
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

        [HttpDelete("deletePost")]
        public IActionResult deletePost([FromBody] DeletePostDTO request)
        {
          Console.Write("deleting post");
          Console.Write(request.Id);
          var postToDelete = _postService.Delete(request.Id);
          if (postToDelete == null)
          {
            return NotFound(new { message = "Post not found." });
          }
          return NoContent();
        }

        [HttpPost("likePost")]
        public IActionResult LikePost([FromBody] LikePostDTO request)
        {
            Console.Write("liking post");
            _postService.Like(request.PostId, request.UserId);
            return NoContent();
        }

        [HttpPost("dislikePost")]
        public IActionResult DislikePost([FromBody] LikePostDTO request)
        {
            Console.Write("Disliking post");
            _postService.Dislike(request.PostId, request.UserId);
            return NoContent();
        }

    }
}
