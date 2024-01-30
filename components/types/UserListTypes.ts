// Whats displayed on a UserListItem
export interface ListUser {
  username: string;
  nickname: string;
  profilePictureUrl: string;
}

// For the abo display
export interface AboRecords {
  followerId: string;
  followingId: string;
  username: string;
  nickname: string;
  profilePictureUrl: string;
}

// For the search function
export interface SearchRecords {
  records: AboRecords[];
  pagination: {
    offset: number;
    limit: number;
    records: number;
  };
}
