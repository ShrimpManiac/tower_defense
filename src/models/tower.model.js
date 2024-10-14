import { ASSET_TYPE } from '../constants';
import { findAssetDataById } from '../init/assets';
import { Tower } from '../classes/tower.class';

let towers = {}; // 타워 목록을 관리

// 타워 초기화
export const clearTowers = (uuid) => {
  towers[uuid] = [];
};

// 전체 타워 Getter
export const getTowers = (uuid) => {
  if (!towers[uuid] || towers[uuid].length === 0) throw new Error(`User ${uuid} has no tower`);
  return towers[uuid];
};

// 타워 Setter
export const setTower = (uuid, tower) => {
  return towers[uuid].push(tower);
};

// Id로 타워 찾기
export function getTowerById(uuid, towerId) {
  if (!towers[uuid] || towers[uuid].length === 0) throw new Error(`User ${uuid} has no tower`);
  let tower = towers[uuid].find((tower) => tower.id === towerId);
  if (!tower) throw new Error(`Tower not found`);
  return tower;
}
