import { Tower } from '../classes/tower.class.js';
import { NormalTower, SlowTower, MultiTower } from '../classes/subTower.class.js';
import { TOWER_TYPE } from '../constants.js';
/**
 * 유저가 보유한 타워목록
 */
let towers = [];

/**
 * 유저가 보유한 타워목록을 비워서 초기화하는 함수
 */
export const clearTowers = () => {
  towers = [];
};

/**
 * 유저가 보유한 타워목록 전체를 조회하는 함수
 * @returns {Tower[]} 유저의 타워 보유목록
 */
export const getTowers = () => {
  return towers;
};

/**
 * 타워를 유저의 타워목록에 추가하는 함수
 * @param {number} towerId 추가할 타워의 인스턴스 ID
 * @returns {Tower} 추가한 타워 객체
 */
export const setTower = (tower) => {
  return towers.push(tower);
};

/**
 * 유저가 보유한 타워목록에서 towerId와 일치하는 타워를 삭제하는 함수
 * @param {number} towerId 삭제할 타워의 인스턴스 ID
 * @returns {Tower} 삭제한 타워 객체
 */
export const deleteTower = (towerId) => {
  checkTowersExist();
  const towerIndex = towers.findIndex((tower) => tower.id === towerId);
  // 예외처리: 타워를 찾지 못함
  if (towerIndex === -1) throw new Error(`Tower not found in deleteTower`);

  const deletedTower = towers[towerIndex];
  towers.splice(towerIndex, 1); // 타워 삭제
  return deletedTower;
};

/**
 * 유저가 보유한 타워목록에서 towerId와 일치하는 타워 객체를 반환하는 함수
 * @param {number} uuid userId
 * @param {number} towerId 검색할 타워의 인스턴스 ID
 * @returns {Tower} 검색한 타워 객체
 */
export const getTowerById = (towerId) => {
  checkTowersExist();
  let tower = towers.find((tower) => tower.id === towerId);
  // 예외처리: 타워를 찾지 못함
  if (!tower) throw new Error(`Tower not found in getTowerById`);
  return tower;
};

/**
 * 유저의 타워 목록이 비어있거나 정의되어있지 않은지 확인하는 예외처리 함수
 *
 * 예외 발생시 에러 반환
 *
 */
const checkTowersExist = () => {
  // 예외처리: 타워 목록이 없거나 비어있음
  if (!towers || towers.length === 0) throw new Error(`User has no tower in checkTowersExist`);
};

export function createTower(assetId, instanceId, spawnLocation) {
  switch (assetId) {
    case TOWER_TYPE.NORMAL:
      return new NormalTower(assetId, instanceId, spawnLocation);
    case TOWER_TYPE.SLOW:
      return new SlowTower(assetId, instanceId, spawnLocation);
    case TOWER_TYPE.MULTI:
      return new MultiTower(assetId, instanceId, spawnLocation);
    default:
      console.error(`알 수 없는 타워 타입: ${assetId}`);
      return null;
  }
}

// 클릭한 타워를 얻는 함수
export function getTowerAtLocation(towers, x, y) {
  // distance = 클릭한 곳과 tower의 중심부와의 거리
  for (const tower of towers) {
    const distance = Math.hypot(tower.x + tower.width / 2 - x, tower.y + tower.height / 2 - y);
    if (distance < tower.width / 2) {
      return tower;
    }
  }
  return null;
}
