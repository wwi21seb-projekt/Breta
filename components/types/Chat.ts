interface Chat {
    chatId: string;
    user: {
      username: string;
      nickname: string;
      profilePictureUrl: string;
    };
    lastMessage: string;
    unreadMessages: number;
    date: string;
  }

export default Chat;