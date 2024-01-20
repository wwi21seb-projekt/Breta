export interface ListUser {
  username: string;
  nickname: string;
  profilePictureUrl: string;
}

export interface ResponseData {
  records: ListUser[];
  pagination: {
    offset: number;
    limit: number;
    records: number;
  };
}
