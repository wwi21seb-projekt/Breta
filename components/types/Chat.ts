interface Chat {
    chatId: string;
    user: {
      username: string;
      nickname: string;
      picture: {
        url: string
      } 
    };
    lastMessage: string;
    unreadMessages: number;
    date: string;
  }

export default Chat;