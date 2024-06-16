interface Post {
  postId: string;
  author: {
    username: string;
    nickname: string;
    picture: {
      url: string;
      width: number;
      height: number;
    }
  },
  creationDate: string;
  content: string;
  picture: {
      url: string;
      width: number;
      height: number;
  },
  likes: number;
  liked: boolean;
  repost: {
    author: {
      username: string;
      nickname: string;
      picture: {
        url: string;
        width: number;
        height: number;
      }
    },
    content: string;
    picture: {
      url: string;
      width: number;
      height: number;
    },
    creationDate: string;
    location: {
      latitude: number;
      longitude: number;
    },
  },
  location: {
    latitude: number;
    longitude: number;
  },
  city: string;
}

export default Post;
