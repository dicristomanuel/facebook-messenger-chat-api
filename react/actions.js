import { New_message } from '../data/socketConstants';

export const ADD_CHAT = 'ADD_CHAT';
export const ADD_CHATS = 'ADD_CHATS';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_MESSAGES = 'ADD_MESSAGES';
export const SET_CHAT_VISIBILITY_FILTER = 'SET_CHAT_VISIBILITY_FILTER';
export const SET_MESSAGES_VISIBILITY_FILTER = 'SET_MESSAGES_VISIBILITY_FILTER';
export const CHAT_UPDATE = 'CHAT_UPDATE';
export const ADD_MEMBER = 'ADD_MEMBER';
export const ADD_ENGAGED_CHAT = 'ADD_ENGAGED_CHAT';
export const REMOVE_ENGAGED_CHAT = 'REMOVE_ENGAGED_CHAT';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const ADD_FLASH_MESSAGE = 'ADD_FLASH_MESSAGE';

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
  SHOW_BUSY: 'SHOW_BUSY',
  SHOW_SOLVED: 'SHOW_SOLVED',
  SHOW_ENGAGED: 'SHOW_ENGAGED'
};

export const AddChat = chat => {
  return { type: ADD_CHAT, chat };
};

export const AddChats = chats => {
  return { type: ADD_CHATS, chats };
};

export const AddMessage = (message) => {
  return { type: ADD_MESSAGE, message };
};

export const AddMessages = messages => {
  return { type: ADD_MESSAGES, messages };
};

export const SetChatVisibilityFilter = filter => {
  return { type: SET_CHAT_VISIBILITY_FILTER, filter };
};

export const SetMessagesVisibilityFilter = chatId => {
  return { type: SET_MESSAGES_VISIBILITY_FILTER, chatId };
};

export const UpdateStatus = data => {
  return { type: CHAT_UPDATE, ...data };
};

export const AddMemberService = data => {
  return { type: ADD_MEMBER, data };
}

export const AddEngagedChat = chatId => {
  return { type: ADD_ENGAGED_CHAT, chatId }
}

export const RemoveEngagedChat = chatId => {
  return { type: REMOVE_ENGAGED_CHAT, chatId }
}

export const AddNotification = notification => {
  return { type: ADD_NOTIFICATION, notification }
}

export const AddFlashMessage = flashMessage => {
  return { type: ADD_FLASH_MESSAGE, flashMessage }
}

export const RemoveNotification = notification => {
  return { type: REMOVE_NOTIFICATION, notification }
}

export const handleClickManifest = chatId => {
  return ({ socket, dispatch, getState }) => {
    let prevChatId = getState().messagesVisibilityFilter;

    socket.off(`${New_message}${prevChatId}`);
    socket.on(`${New_message}${chatId}`, (message) => {
      dispatch(AddMessage(message));
    });

    dispatch(SetMessagesVisibilityFilter(chatId));
    dispatch(RemoveNotification(chatId));
  };
}
