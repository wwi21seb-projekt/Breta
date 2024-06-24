export interface Post {
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
  repostPostContent: string;
  picture: {
      url: string;
      width: number;
      height: number;
  },
  repostPostPicture: {
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

export interface PostRecords {
  records: Post[];
  pagination: {
    lastPostId: string;
    limit: number;
    records: number;
  };
  error: {
    message: string;
    code: string;
  };
}
