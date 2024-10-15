import socket from '../init/socket.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';

// 유저 등록 핸들러
const registerHandler = (io) => {
  io.on('connection', (socket) => {
    const { uuid } = socket.handshake.query;
    const userUUID = uuid || uuidv4();

    handleConnection(socket, userUUID);

    socket.on(`event`, (data) => handleEvent(io, socket, data));
    socket.on('disconnect', (sockets) => handleDisconnect(socket));
  });
};

export default registerHandler;
