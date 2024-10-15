import { createScore, getScore, setScore } from '../models/score.model.js';

/**
 * 스코어 최초 초기화
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Object} 성공 여부를 알리는 상태와 메세지
 */

export const initScore = (uuid) => {
  try {
    const initResult = createScore(uuid);
    if (initResult.status !== 'success') throw new Error(initResult.message);
    return { status: initResult.status, message: 'Successfully initialized Score' };
  } catch (err) {
    console.error(err.message);
    return { status: 'failure', message: err.message };
  }
};

/**
 * DB에 저장된 스코어 불러와서 반환해주는 함수 (클라이언트용)
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Object} 성공 여부를 알리는 상태와 메세지, highScore
 */

export const getHighScore = (uuid) => {
  try {
    //INCOMPLETE: DB 구성 완료되면 구현가능
    const fetchedScore = 0; // 해당 위치에 db에 저장된 score 불러옴
    if (fetchedScore === undefined || !fetchedScore) throw new Error('Failed to fetch DB Score');
    return {
      status: 'success',
      message: 'Successfully retrieved db score',
      highScore: fetchedScore,
    };
  } catch (err) {
    console.error(err.message);
    return { status: 'failure', message: err.message };
  }
};

/**
 * 현재 점수 불러오는 함수 (클라이언트용)
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Object} 성공 여부를 알리는 상태와 메세지,currentScore
 */
export const getCurrentScore = (uuid) => {
  try {
    const currentScore = getScore(uuid);
    if (!currentScore) throw new Error('Failed to retrieved score');
    return { status: 'success', message: 'Successfully retrieved current score', currentScore };
  } catch (err) {
    console.error(err.message);
    return { status: 'failure', message: err.message };
  }
};
/**
 * 점수 증가 함수 (인자에 추가시킬 점수만 넣으면 됨)
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Object} 성공 여부를 알리는 상태와 메세지
 */
export const updateIncreaseScore = (uuid, increaseScore) => {
  try {
    const currentScore = getScore(uuid);
    if (!currentScore) throw new Error('Failed to retrieved score');

    const updateScore = currentScore + Number(increaseScore);
    if (updateScore < 0) throw new Error('Score is less than 0');

    const setScoreResult = setScore(uuid, updateScore);
    if (setScoreResult.status !== 'success') throw new Error('Failed to set score');

    return { status: setScoreResult.status, message: setScoreResult.message };
  } catch (err) {
    console.error(err.message);
    return { status: 'failure', message: err.message };
  }
};

/**
 * db에 최고 점수 기록용
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Object} 성공 여부를 알리는 상태와 메세지
 */

export const saveHighScore = (uuid, score) => {
  try {
    const currentScore = getScore(uuid);
    if (!currentScore) throw new Error('Failed to retrieved score');

    const currentHighScore = getHighScore(uuid);
    if (!currentHighScore) throw new Error('Failed to retrieved high score');

    const highScore = Math.max(currentScore, currentHighScore.highScore);
    if (isNaN(highScore)) throw new Error('Failed to update high score');
    //INCOMPLETE: DB 구성 완료되면 구현가능
    // db 처리(highScore 넘김)
    const dbResult = { status: 'success', message: 'Successfully updated high score' }; // 해당 위치에 db에 저장된 결과 불러옴
    return { status: dbResult.status, message: dbResult.message };
  } catch (err) {
    console.error(err.message);
    return { status: 'failure', message: err.message };
  }
};
