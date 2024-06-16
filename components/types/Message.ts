interface Message {
    id: string;
    content: string;
    sender: {
      username: string;
    };
    creationDate: string;
  }

  export default Message;