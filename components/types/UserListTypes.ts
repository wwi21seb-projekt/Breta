// Whats displayed on a UserListItem
export interface ListUser {
  username: string;
  nickname: string;
  picture: {
    url: string
  }
}

// For the abo display
export interface AboRecords {
  followerId: string;
  followingId: string;
  username: string;
  nickname: string;
  picture: {
    url: string
  }
}

// For the search function
export interface UserRecords {
  records: AboRecords[];
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
