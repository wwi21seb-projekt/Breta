export interface User {
  username: string;
  nickname: string;
  status: string;
  picture: {
    url: string
  };
  follower: number;
  following: number;
  posts: number;
  subscriptionId: string;
}
