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
            var updatedPosts = _postService.Create(post);
            return Ok(updatedPosts);
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
          var existingPost = _postService.GetById(updatedPost.Id);
          
          if (existingPost == null)
          {
            return NotFound(new { message = "Post not found." });
          }
          
          existingPost.Content = updatedPost.Content;
          existingPost.Timestamp = updatedPost.Timestamp;
          
          try {
            _postService.Update(existingPost);
          } catch (Exception e) 
          {
            return BadRequest(new { message = e.Message });
          }
          return Ok(existingPost);
        }

        [HttpDelete("deletePost")]
        public IActionResult deletePost([FromBody] DeletePostDTO request)
        {
          Console.Write("deleting post");
          Console.Write(request.Id);
          try {
            var response = _postService.Delete(request.Id);
            if (response == null)
            {
              return NotFound(new { message = "Post not found." });
            }
            return Ok(response);
          } catch (Exception e)
          {
            return BadRequest(new { message = e.Message });
          }

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
