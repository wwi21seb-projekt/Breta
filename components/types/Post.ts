interface Post {
  postId: string;
  author: {
    username: string;
    profilePictureUrl: string;
  };
  creationDate: string;
  content: string;
  likes: string;
  location: string;
  city: string;
}

export default Post;
