// 현재 플레이중인 유저 목록
const users = [];

// 유저 추가
export const addUser = (user) => {
  users.push(user);
};

// 유저 삭제
export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

// 유저목록 조회
export const getUsers = () => {
  return users;
};
