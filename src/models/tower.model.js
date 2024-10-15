import { Tower } from '../classes/tower.class';

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
};

/**
 * 유저가 보유한 타워목록 전체를 조회하는 함수
 * @param {number} uuid userId
 * @returns {Tower[]} 유저의 타워 보유목록
 */
export const getTowers = (uuid) => {
  // 예외처리: 타워 목록이 없거나 비어있음
  if (!towers[uuid] || towers[uuid].length === 0) throw new Error(`User ${uuid} has no tower.`);
  return towers[uuid];
};

/**
 * 타워를 유저의 타워목록에 추가하는 함수
 * @param {number} uuid userId
 * @param {number} towerId 추가할 타워의 인스턴스 ID
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
export function getTowerById(uuid, towerId) {
  // 예외처리: 타워 목록이 없거나 비어있음
  if (!towers[uuid] || towers[uuid].length === 0) throw new Error(`User ${uuid} has no tower.`);
  let tower = towers[uuid].find((tower) => tower.id === towerId);
  // 예외처리: 타워를 찾지 못함
  if (!tower) throw new Error(`Tower not found.`);
  return tower;
}
