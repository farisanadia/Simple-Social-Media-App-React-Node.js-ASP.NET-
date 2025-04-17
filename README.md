# Simple Social Media App (React, Node.js, ASP.NET)
Simple application that allows users to share posts with other people, read others peoples posts, and comment on each others posts.

Built using React, Node.js, and ASP.NET (C#).

## TO RUN:
cd into frontend: `npm start`

cd into backend: `dotnet run`

## TODO:

### To Fix:

- [x] change posts to also contain userid so i can find them based on user id ==> change finduserposts to use userid instead of username
- [x] treat comment as post object, but somehow indicate that it is a post. this allows me to edit and delete my comments, as well as reply to comments.
- [ ] clean up entire code base, ensuring it complies with OOP and SOLID principles, and uses ASP.NET and C# best practices.

### Main Functionality:

#### Users:
- [x] create user
- [x] log in
- [x] log out
- [x] delete account. when user deletes account, all posts posted by user should also be deleted.

#### Posts:
- [x] create post
- [x] view other peoples post
- [x] view your own post
- [x] edit your own posts
- [x] delete your own posts
- [x] comment on other peoples posts
- [x] delete comment
- [x] thumbs up/thumbs down

#### UI:
- [ ] login/create account ui
- [ ] post component ui
- [ ] post creation ui
- [ ] homepage ui
- [ ] profile ui
