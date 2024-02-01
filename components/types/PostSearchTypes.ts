export interface Post {
  postId: string;
  author: {
    username: string;
    nickname: string;
    profilePictureUrl: string;
  };
  creationDate: string;
  content: string;
  location: {
    longitude: string;
    latitude: string;
    accuracy: number;
  };
}

export interface PostRecords {
  records: Post[];
  pagination: {
    lastPostId: string;
    limit: number;
    records: number;
  };
}
