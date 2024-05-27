interface Post {
  postId: string;
  author: Author;
  creationDate: string;
  content: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  city?: any;
  likes: number;
  liked: boolean;
}

interface Author {
  username: string;
  profilePictureUrl: string;
}
export default Post;
