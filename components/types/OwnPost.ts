export interface OwnPost {
  postId: string;
  creationDate: string;
  content: string;
  likes: number;
  liked: boolean;
  location: {
    longitude: number;
    latitude: number;
    accuracy: number;
  };
  city: string;
  repost: {
    author: {
      username: string;
    }
  }
}

export interface ResponseOwnPost {
  records: OwnPost[];
  pagination: {
    offset: number;
    limit: number;
    records: number;
  };
  error: {
    message: string;
    code: string;
  };
}
