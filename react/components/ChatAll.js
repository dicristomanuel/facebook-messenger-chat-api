import React from 'react';
import { InitChatsAndSockets } from './helpers/chatAllHelper';
import VisibleChatList from '../containers/VisibleChatList';
import { Provider } from 'react-redux';
import Store from '../createStore';
import Header from './Header';
import Footer from './Footer';

InitChatsAndSockets()

const ChatAll = () => (
  <Provider store={Store}>
    <div>
      <Header origin='ChatAll' />
      <VisibleChatList />
      <Footer />
    </div>
  </Provider>
);

export default ChatAll;