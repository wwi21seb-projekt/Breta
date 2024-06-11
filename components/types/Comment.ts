interface Comment {
    commentId: string;
    content: string;
    author: {
      username: string | null;
      nickname: string;
      profilePictureURL: string;
    };
    creationDate: string;
    pagination?: {
        offset: number;
        limit: number;
        records: number;
    }
}

  export default Comment;