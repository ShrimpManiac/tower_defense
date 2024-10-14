import { createAccount, deleteAccount } from '../models/account.model.js';
import { initializeStage } from './stage.handler.js';
import { getCurrentScore, saveHighScore, initScore } from './score.handler.js';
import { deleteStage } from '../models/stage.model.js';
import { deleteScore } from '../models/score.model.js';

export const gameStart = (uuid) => {
  try {
    // 초기화 진행
    initializeStage(uuid);
    createAccount(uuid);
    initScore(uuid);
    // INCOMPLETE: 타워 초기화, 몬스터 초기화 추가해야 함
    console.log(`[INIT] game execution completed - ${uuid}`);
  } catch (err) {
    console.error(err.message);
    return { status: 'fail', message: err.message };
  }

  return { status: 'success', message: `Game started` };
};

export const gameEnd = (uuid) => {
  try {
    // 최고 점수 여부 판단 후 기록
    const saveResult = saveHighScore(uuid);
    if (saveResult.status === fail) throw new Error(saveResult.message);
    // 해당 uuid 삭제 진행
    deleteAccount(uuid);
    deleteStage(uuid);
    deleteScore(uuid);
    //INCOMPLETE: 몬스터, 타워 삭제 추가해야 함.
  } catch (err) {
    console.error(err.message);
    return { status: 'fail', message: err.message };
  }

  return { status: 'success', message: 'Game ended' };
};
