interface Message {
    id: string;
    content: string;
    sender: {
      username: string;
    };
    date: string;
  }

  export default Message;