/**
 * SendEvent에 사용되는 이벤트 인스턴스 고유ID
 */
let eventId = 0;

/**
 * SendEvent에 사용할 이벤트 인스턴스의 고유ID를 생성하는 함수
 * @returns {Number} eventId
 */
export const generateEventId = () => {
  return eventId++;
};
