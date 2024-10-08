import { ASSET_TYPE } from '../constants.js';
import { findAssetDataById } from '../init/assets.js';
import { unlockItems } from './item.model.js';

// key: uuid, value: array
// stages[uuid] = { id, score, scorePerSecond, timestamp }
const stages = {};

// 초기화
export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, stageId, timestamp) => {
  const { id, score: requiredScore, scorePerSecond } = findAssetDataById(ASSET_TYPE.STAGE, stageId);
  const result = stages[uuid].push({ id, requiredScore, scorePerSecond, timestamp });
  unlockItems(uuid);

  return result;
};

export const clearStage = (uuid) => {
  return (stages[uuid] = []);
};
