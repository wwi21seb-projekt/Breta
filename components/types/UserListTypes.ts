export interface User {
    username: string;
    nickname: string;
    profilePictureUrl: string;
  }

export interface ResponseData {
    records: User[];
    pagination: {
        offset: number;
        limit: number;
        records: number;
    };
}