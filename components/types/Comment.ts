interface Comment {
    commentId: string;
    content: string;
    author: {
      username: string;
      nickname: string;
      profilePictureURL: string;
    };
    creationDate: string;
  }

  export default Comment;