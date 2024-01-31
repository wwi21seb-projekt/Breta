export interface OwnPost {
  postId: string;
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
}
