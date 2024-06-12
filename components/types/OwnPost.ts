export interface OwnPost {
  postId: string;
  repost: Object;
  creationDate: string;
  content: string;
  location: {
    longitude: number;
    latitude: number;
    accuracy: number;
  };
  city: string;
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
