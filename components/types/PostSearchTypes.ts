export interface Post {
  postId: string;
  author: {
    username: string;
    nickname: string;
    picture: {
      url: string
    } 
  };
  likes: number;
  liked: boolean;
  creationDate: string;
  content: string;
  location: {
    longitude: string;
    latitude: string;
    accuracy: number;
  };
  repost: {
    author: {
      username: string;
      picture: {
        url: string;
      }
    }
  }
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
