export interface OwnPost {
    postId: string;
    creationDate: string;
    content: string;
    location: {
      longitude: string;
      latitude: string;
      accuracy: string;
    };
}

export interface ResponseOwnPost {
    records: OwnPost[];
    pagination: {
    offset: number;
    limit: number;
    records: number;
  };
}