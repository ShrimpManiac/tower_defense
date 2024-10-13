import { ASSET_TYPE } from '../constants.js';
import { findAssetDataById } from '../init/assets.js';

// key: uuid, value: array
// stages[uuid] = { id, monsterIds, numMonsters, timestamp }
const stages = {};

// 초기화
export const createStage = (uuid) => {
  stages[uuid] = [];
  return { status: 'success', message: 'Stage create successful' };
};

export const getStage = (uuid) => {
  if (stages[uuid] === undefined) throw new Error('Stage Not Found'); // 스테이지 존재 여부 확인
  return stages[uuid];
};

export const setStage = (uuid, stageId, timestamp) => {
  if (stages[uuid] === undefined) throw new Error('Stage Not Found'); // 스테이지 존재 여부 확인
  const { id, monsterIds, numMonsters } = findAssetDataById(ASSET_TYPE.STAGE, stageId);
  stages[uuid].push({ id, monsterIds, numMonsters, timestamp });

  return { status: 'success', message: 'Stage successfully set.' };
};

export const deleteStage = (uuid) => {
  if (stages[uuid] === undefined) throw new Error('Stage Not Found'); // 스테이지 존재 여부 확인
  delete stages[uuid]; // 스테이지 삭제
  return { status: 'success', message: 'Stage delete successful' };
};
