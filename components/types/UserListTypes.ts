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

export interface ListRecords {
  subscriptionId: string,
    subscriptionDate: string,
    user: ListUser,
}

export interface FollowerResponseData {
  records: ListRecords[];
  pagination: {
    offset: number;
    limit: number;
    records: number;
  };
}
