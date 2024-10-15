const scores = {};

export const createScore = (uuid) => {
  scores[uuid] = 0;
  return { status: 'success', message: 'Score create successful' };
};

export const getScore = (uuid) => {
  if (scores[uuid] === undefined) throw new Error('Score Not Found'); // 스코어 존재 여부 확인
  return { status: 'success', message: 'Score successfully set.', score: scores[uuid] };
};

export const setScore = (uuid, score) => {
  if (scores[uuid] === undefined) throw new Error('Score Not Found'); // 스코어 존재 여부 확인
  scores[uuid] = score;
  return { status: 'success', message: 'Score successfully set.' };
};

export const deleteScore = (uuid) => {
  if (scores[uuid] === undefined) throw new Error('Score Not Found'); // 스코어 존재 여부 확인
  delete scores[uuid]; // 스코어 삭제
  return { status: 'success', message: 'Score delete successful' };
};
