import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMappings.js';
import { addUser, getUsers, removeUser } from '../models/user.model.js';
import { createStage } from '../models/stage.model.js';
import { createAccount } from '../models/account.model.js';
import { generateEventId } from '../utils/generateEventId.js';

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
  createAccount(uuid);
  // createTower 만들기

  socket.emit('connection', { uuid });
};

// Event 핸들러
export const handleEvent = (io, socket, data) => {
  // 클라이언트 버전 체크
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit(`${data.eventId}_response`, { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  // 핸들러ID 체크
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit(`${data.eventId}_response`, { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);

  // Broadcast 처리
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  // Response 전달
  socket.emit(`${data.eventId}_response`, response);
};

/**
 * 서버에서 클라이언트로 보내는 sendEvent
 *
 * 사용 예시: const response = await sendEvent(11, {monsterId});
 * @param {number} handlerId 이벤트 핸들러 ID (client\handlers\handlerMappings)
 * @param {json} payload 클라이언트로 보낼 데이터
 * @returns
 */
export const sendEventToClient = (handlerId, payload) => {
  return new Promise((resolve, reject) => {
    let eventId = generateEventId();
    socket.emit('event', {
      handlerId,
      eventId,
      payload,
    });
    // 해당 handlerId에 대한 응답을 기다림
    socket.once(`${eventId}_response`, (data) => {
      // 성공 시 데이터를 반환
      if (data.status === 'success') {
        resolve(data);
      } else {
        reject(data);
      }
    });
  });
};
