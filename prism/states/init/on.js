import { New_chat } from '../../../data/socketConstants';
import { Socket } from '../../../app/transformer';

export const OnInit = (data) => {
  const { io } = data;
  io.emit(New_chat, Socket.chat(data));
  return {...data, state: 'bot'};
}
