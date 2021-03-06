import { Server } from 'hapi';
import Good from 'good';
import GoodConsole from 'good-console';
import Blipp from 'blipp';
import Inert from 'inert';
import Joi from 'joi';
import { Consumer, MemberService } from './app/appConstants';
import { GetChats, UpdateStatus, GetMessages } from './app/helper';
import Parser from './app/parser';
import Auth from './app/auth';
import Yar from 'Yar'
import { CookieToken, FbToken } from './app/tokens';

const server = new Server();
const PORT = process.env.PORT || 3001;

server.connection({
  port: PORT
});

const io = require('socket.io')(server.listener);

server.register([
  Inert,
  { register: Blipp },
  { register: Good,
    options: {
      reporters: [{
        reporter: GoodConsole,
        events: { log: '*', response: '*' }
      }]
    },
  },
  {
    register: Yar,
    options: {cookieOptions: {
      password: CookieToken,
      isSecure: false
    }
  }
}], (err) => {
  if (err)
  throw err;

  // main, auth & assets ====>

  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: './public/assets',
        listing: false,
        index: true
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (request, reply) => {
      const { hash, name } = request.query;
      Auth({ hash, name })
      .then(() => {
        request.yar.set({ hash, name });
        reply.file('./public/index.html');
      })
      .catch(() => {
        reply('No access permitted');
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/member-service/login',
    handler: (request, reply) => {
      const { hash, name } = request.payload;
      Auth({ hash, name })
      .then(() => {
        request.yar.set({ hash, name });
        reply.redirect('/');
      })
      .catch(() => {
        reply('No access permitted');
        // redirect back to GC with error message
      });
    }
  });

  // message hooks ====>

  // setup messenger webhook - comment out
  // server.route({
  //   method: 'GET',
  //   path: '/webhook',
  //   handler(req, reply) {
  //     if (req.query['hub.verify_token'] === FbToken) {
  //       reply(req.query['hub.challenge']);
  //     } else {
  //       reply('Error, wrong validation token');
  //     }
  //   }
  // });

  server.route({
    method: 'POST',
    path: '/webhook',
    handler(request, reply) {
      const messaging_events = request.payload.entry[0].messaging;
      for (let i = 0; i < messaging_events.length; i++) {
        const event = request.payload.entry[0].messaging[i];
        const sender = event.sender.id;
        if (event.message) {
          const text = event.message.text || event.message.attachments[0].payload.url;
          Parser({io, sender, text, userType: Consumer});
        }
      }
      reply();
    }
  });

  server.route({
    method: 'POST',
    path: '/member-service',
    handler(request, reply) {
      const { chatId, text } = request.payload;
      Parser({ chatId, text, io, userType: MemberService });
      reply();
    }
  });

  // helpers ====>

  server.route({
    method: 'GET',
    path: '/get-chats',
    handler(request, reply) {
      const msAuth = request.yar._store;
      GetChats(msAuth).then((chats) => {
        reply({ allChats: chats[0], engagedChats: chats[1], msAuth })
      });
    }
  });

  server.route({
    method: 'PUT',
    path: '/update-chat',
    config: {
      validate: {
        payload: {
          chatId: Joi.number().required(),
          key: Joi.required(),
          value: Joi.required(),
        },
      },
    },
    handler(request, reply) {
      UpdateStatus(io, request.payload);
      reply();
    }
  });

  server.route({
    method: 'GET',
    path: '/get-messages',
    handler(request, reply) {
      const { id, page } = request.query;
      GetMessages(id, page).then(reply);
    }
  });
});

server.start((error) => {
  if (error) {
    console.log(error.message);
    process.exit(1);
  }
  console.log(`server is running on port ${PORT}`);
});
