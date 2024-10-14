import { ASSET_TYPE } from '../constants';
import { findAssetDataById } from '../init/assets';
import { Tower } from '../classes/towers/tower.class';

let towers = {}; // 타워 목록을 관리

// 타워 초기화
export const clearTowers = (uuid) => {
  towers[uuid] = [];
};

// 전체 타워 Getter
export const getTowers = (uuid) => {
  return towers[uuid];
};

// 타워 Setter
export const setTowers = (uuid, tower) => {
  return towers[uuid].push(tower);
};

// Id로 타워 찾기
function getTowerById(uuid, towerId) {
  if (!towers[uuid] || towers[uuid].length === 0) {
    return null;
  }

  let tower = towers[uuid].find((tower) => tower.id === towerId);
  return tower;
}
