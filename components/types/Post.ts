interface Post {
    postId: string;
    author: {
      username: string;
      profilePictureUrl: string;
    };
    creationDate: string;
    content: string;
    likes: string;
  }

export default Post;