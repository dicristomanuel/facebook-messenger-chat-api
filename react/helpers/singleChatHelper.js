import request from 'superagent';
import Store from '../createStore';
import { New_message } from '../../data/socketConstants';
import { AddMessage, AddMessages, SetMessagesVisibilityFilter, AddEngagedChat,
  RemoveEngagedChat, AddNotification, RemoveNotification } from '../actions';

  const socket = io();

  const getMessages = (id, page) => {
    return new Promise((resolve, reject) => {
      request.get(`http://localhost:3001/get-messages?id=${id}&page=${page}`)
      .end((err, res) => {
        if (err)
        reject(err);
        else
        resolve(res.body);
      });
    });
  };

  const initSocketsEngaged = (chatId, value) => {
    if (value) {
      Store.dispatch(AddEngagedChat(chatId))
      socket.on(`${New_message}${chatId}`, (message) => {
        Store.dispatch(AddNotification(message.chatId));
      });
    } else {
      Store.dispatch(RemoveEngagedChat(chatId))
      socket.removeListener(`${New_message}${chatId}`);
    }
  }

  export const SendMessage = (data) => {
    const { chatId, text } = data;
    request.post(`http://localhost:3001/member-service`)
    .send({ chatId, text })
    .end((err, res) => {
      if (err)
      console.log(err);
    });
  }

  export const SetEngageForChat = (chatId, value) => {
    initSocketsEngaged(chatId, value);
    request.put('http://localhost:3001/update-chat')
    .send({ chatId, key: 'engaged', value })
    .end((err, res) => {
      if (err)
      console.log(err);
    });
  };

  export const Compare = (a,b) => {
    if (a.id < b.id)
    return -1;
    else if (a.id > b.id)
    return 1;
    else
    return 0;
  }

  export const LoadMessages = (id, page) => {
    return new Promise((resolve, reject) => {
      getMessages(id, page)
      .then((messages) => {
        Store.dispatch(AddMessages(messages));
        resolve(messages.length);
      })
      .catch((error) => {reject(error)});
    })
  };

  export const InitMessagesAndSockets = (id, page = 1) => {
    Store.dispatch(SetMessagesVisibilityFilter(id));
    socket.on(`${New_message}${id}`, (message) => {
      Store.dispatch(AddMessage(message));
    });
    return LoadMessages(id, page);
  };
