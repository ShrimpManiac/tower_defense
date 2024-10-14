import { CLIENT_VERSION } from '../constants.js';
import { generateEventId } from '../utils/generateEventId.js';
import { io } from 'https://cdn.socket.io/4.8.0/socket.io.esm.min.js';
import handlerMappings from '../handlers/handlerMappings.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

socket.on('event', (data) => {
  // 핸들러ID 체크
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit(`${data.eventId}_response`, { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);

  // Response 전달
  socket.emit(`${data.eventId}_response`, response);
});

/**
 * 사용 예시: const response = await sendEvent(23, {towerId});
 * @param {number} handlerId 핸들러 ID (src\handlers\handlerMapping)
 * @param {json} payload 서버로 보낼 데이터
 * @returns
 */
const sendEvent = (handlerId, payload) => {
  return new Promise((resolve, reject) => {
    let eventId = generateEventId();
    socket.emit('event', {
      userId,
      clientVersion: CLIENT_VERSION,
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

export { sendEvent };
