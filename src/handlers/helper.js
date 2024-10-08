import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMappings.js';
import { addUser, getUsers, removeUser } from '../models/user.model.js';
import { createStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

// Disconnect 핸들러
export const handleDisconnect = (socket) => {
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', getUsers());
};

// Connection 핸들러
export const handleConnection = (socket, uuid) => {
  addUser({ uuid: uuid, socketId: socket.id });
  console.log(`New user connected: ${uuid} with socket ID ${socket.id}`);
  console.log('Current users: ', getUsers());

  createStage(uuid);

  const assets = getGameAssets();
  socket.emit('connection', { uuid, assets });
};

// Event 핸들러
export const handleEvent = (io, socket, data) => {
  // 클라이언트 버전 체크
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  // 핸들러ID 체크
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);

  // Broadcast 처리
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  // Response 전달
  socket.emit('response', { response });
};
