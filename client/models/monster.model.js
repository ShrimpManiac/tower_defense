import { Monster } from '../classes/monster.class.js';

/**
 * 소환할 몬스터의 애셋ID 목록
 * @type {number[]}
 */
export let monsterSpawnQueue = [];

/**
 * 소환된 몬스터 객체 목록
 * @type {Monster[]}
 */
export let spawnedMonsters = [];

/**
 * 소환된 몬스터 목록을 비워서 초기화하는 함수
 */
export const clearMonsters = () => {
  spawnedMonsters = [];
  monsterSpawnQueue = [];
};

/**
 * 몬스터를 소환된 몬스터 목록에 추가하는 함수
 * @param {number} monster 추가할 몬스터 객체
 * @returns {Monster} 추가한 몬스터 객체
 */
export const setMonster = (monster) => {
  return spawnedMonsters.push(monster);
};

/**
 * 몬스터를 소환 큐에 추가하는 함수
 * @param {number} assetId 추가할 몬스터 애셋 ID
 */
export const addToSpawnQueue = (assetId) => {
  monsterSpawnQueue.push(assetId);
};

/**
 * 소환된 몬스터 목록에서 monsterId와 일치하는 몬스터를 삭제하는 함수
 * @param {number} monsterId 삭제할 몬스터의 인스턴스 ID
 * @returns {Monster} 삭제한 몬스터 객체
 */
export const deleteMonster = (monsterId) => {
  checkMonstersExist();
  const monsterIndex = spawnedMonsters.findIndex((monster) => monster.id === monsterId);
  // 예외처리: 몬스터를 찾지 못함
  if (monsterIndex === -1) throw new Error(`Monster not found.`);
  const deletedMonster = spawnedMonsters[monsterIndex];
  spawnedMonsters.splice(monsterIndex, 1); // 몬스터 삭제
  return deletedMonster;
};

/**
 * 소환된 몬스터 목록에서 monsterId와 일치하는 몬스터 객체를 반환하는 함수
 * @param {number} monsterId 검색할 몬스터의 인스턴스 ID
 * @returns {Monster} 검색한 몬스터 객체
 */
export const getMonsterById = (monsterId) => {
  checkMonstersExist();
  let monster = spawnedMonsters.find((monster) => monster.id === monsterId);
  // 예외처리: 몬스터를 찾지 못함
  if (!monster) throw new Error(`monster not found.`);
  return monster;
};

/**
 * 소환된 몬스터 목록이 비어있거나 정의되어있지 않은지 확인하는 예외처리 함수
 *
 * 예외 발생시 에러 반환
 */
const checkMonstersExist = () => {
  // 예외처리: 타워 목록이 없거나 비어있음
  if (!spawnedMonsters || spawnedMonsters.length === 0) throw new Error(`No monsters are spawned.`);
};
