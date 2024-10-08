import { getGameAssets } from '../init/assets.js';
import { createItems } from '../models/item.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';
import { calculateScore, verifyScore } from './../utils/score.js';

// Payload: { timestamp }
export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  clearStage(uuid);
  createItems(uuid);
  // stages 배열에서 0번째 = 첫번째 스테이지
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log(`Stage: `, getStage(uuid));

  return { status: 'success', message: `Game started` };
};

// Payload: { timestamp, score }
export const gameEnd = (uuid, payload) => {
  // 클라이언트는 게임 종료 시 타임스탬프와 총 점수를 전달
  const { timestamp: gameEndTime, score: clientScore } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for use' };
  }

  // 각 스테이지의 지속시간을 계산하여 총 점수 계산
  const serverScore = calculateScore(uuid, gameEndTime);

  // 서버와 클라이언트의 점수가 오차범위 이내로 일치하는지 검증
  const scoreMatch = verifyScore(uuid, clientScore, serverScore);
  if (!scoreMatch) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // DB 저장한다고 가정한다면
  // setResult(userId, score, timestamp);

  return { status: 'success', message: 'Game ended', clientScore };
};
