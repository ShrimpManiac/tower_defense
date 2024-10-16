import { Tower } from '../classes/tower.class.js';
import { TOWER_TYPE } from '../constants.js';
import { NormalTower, SlowTower, MultiTower } from '../classes/subTower.class.js';

/**
 * 유저가 보유한 타워목록
 */
let towers = {};

/**
 * 유저가 보유한 타워목록을 비워서 초기화하는 함수
 * @param {number} uuid userId
 */
export const clearTowers = (uuid) => {
  towers[uuid] = [];
  return { status: 'success', message: 'tower create successful' };
};

/**
 * 유저가 보유한 타워목록 전체를 조회하는 함수
 * @param {number} uuid userId
 * @returns {Tower[]} 유저의 타워 보유목록
 */
export const getTowers = (uuid) => {
  checkTowersExist(uuid);
  return towers[uuid];
};

/**
 * 타워를 유저의 타워목록에 추가하는 함수
 * @param {number} uuid userId
 * @param {number} tower 추가할 타워 객체
 * @returns {Tower} 추가한 타워 객체
 */
export const setTower = (uuid, tower) => {
  return towers[uuid].push(tower);
};

/**
 * 유저가 보유한 타워목록에서 towerId와 일치하는 타워를 삭제하는 함수
 * @param {number} uuid userId
 * @param {number} towerId 삭제할 타워의 인스턴스 ID
 * @returns {Tower} 삭제한 타워 객체
 */
export const deleteTower = (uuid, towerId) => {
  checkTowersExist(uuid);
  const towerIndex = towers[uuid].findIndex((tower) => tower.id === towerId);

  // 예외처리: 타워를 찾지 못함
  if (towerIndex === -1) throw new Error(`Tower not found.`);

  const deletedTower = towers[uuid][towerIndex];
  towers[uuid].splice(towerIndex, 1); // 타워 삭제
  return deletedTower;
};

/**
 * 유저가 보유한 타워목록에서 towerId와 일치하는 타워 객체를 반환하는 함수
 * @param {number} uuid userId
 * @param {number} towerId 검색할 타워의 인스턴스 ID
 * @returns {Tower} 검색한 타워 객체
 */
export const getTowerById = (uuid, towerId) => {
  checkTowersExist(uuid);
  let tower = towers[uuid].find((tower) => tower.id === towerId);
  // 예외처리: 타워를 찾지 못함
  if (!tower) throw new Error(`Tower not found.`);
  return tower;
};

/**
 * 유저의 타워 목록이 비어있거나 정의되어있지 않은지 확인하는 예외처리 함수
 *
 * 예외 발생시 에러 반환
 * @param {number} uuid userId
 */
const checkTowersExist = (uuid) => {
  // 예외처리: 타워 목록이 없거나 비어있음
  if (!towers[uuid] || towers[uuid].length === 0) throw new Error(`User ${uuid} has no tower.`);
};

export const upgradeTowerById = (uuid, towerId) => {
  checkTowersExist(uuid);
  let tower = getTowerById(uuid, towerId);
  // 타워 업그레이드

  tower.applyUpgrades();
  // 결과 반환
  const updatedTowerInfo = `${tower.level},${tower.attackPower},${tower.range},${tower.upgradeCost},${tower.sellCost},${tower.skillDuration},${tower.skillValue}`;
  return updatedTowerInfo;
};

export function createTower(assetId, spawnLocation) {
  switch (assetId) {
    case TOWER_TYPE.NORMAL:
      return new NormalTower(assetId, spawnLocation);
    case TOWER_TYPE.SLOW:
      return new SlowTower(assetId, spawnLocation);
    case TOWER_TYPE.MULTI:
      return new MultiTower(assetId, spawnLocation);
    default:
      console.error(`알 수 없는 타워 타입: ${assetId}`);
      return null;
  }
}

export function isValidPlacement(uuid, x, y) {
  if (!towers[uuid]) {
    return true; // 타워 목록이 없으면 설치 위치가 유효함
  }

  for (const tower of towers[uuid]) {
    const distance = Math.hypot(tower.x - x, tower.y - y);
    if (distance < 100) {
      // 최소 거리 제한 (타워 간의 거리)
      return false;
    }
  }
  return true;
}
