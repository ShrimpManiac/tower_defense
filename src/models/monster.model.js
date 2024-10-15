import { Monster } from '../classes/monster.class.js';

/**
 * 소환할 몬스터의 애셋ID 목록
 * @key uuid
 * @value number[]
 */
export let monstersToSpawn = {};

/**
 * 소환된 몬스터 객체 목록
 * @key uuid
 * @value Monster[]
 */
export let spawnedMonsters = {};

/**
 * 소환된 몬스터 목록을 비워서 초기화하는 함수
 * @param {number} uuid userId
 */
export const clearMonsters = (uuid) => {
  monstersToSpawn[uuid] = [];
  spawnedMonsters[uuid] = [];
};

/**
 * 소환된 몬스터 목록 전체를 조회하는 함수
 * @param {number} uuid userId
 * @returns {Monster[]} 소환된 몬스터 배열
 */
export const getMonsters = (uuid) => {
  checkMonstersExist(uuid);
  return monstersToSpawn[uuid];
};

/**
 * 몬스터를 소환된 몬스터 목록에 추가하는 함수
 * @param {number} uuid userId
 * @param {Monster} monster 추가할 몬스터 객체
 * @returns {Monster} 추가한 몬스터 객체
 */
export const setMonster = (uuid, monster) => {
  return monstersToSpawn[uuid].push(monster);
};

/**
 * 몬스터를 소환 큐에 추가하는 함수
 * @param {number} uuid userId
 * @param {number} assetId 추가할 몬스터 애셋 ID
 */
export const addToSpawnQueue = (uuid, assetId) => {
  monstersToSpawn[uuid].push(assetId);
};

/**
 * 소환된 몬스터 목록에서 monsterId와 일치하는 몬스터를 삭제하는 함수
 * @param {number} uuid userId
 * @param {number} monsterId 삭제할 몬스터의 인스턴스 ID
 * @returns {Monster} 삭제한 몬스터 객체
 */
export const deleteMonster = (uuid, monsterId) => {
  checkMonstersExist(uuid);
  const monsterIndex = monstersToSpawn[uuid].findIndex((monster) => monster.id === monsterId);
  // 예외처리: 몬스터를 찾지 못함
  if (monsterIndex === -1) throw new Error(`Monster not found.`);
  const deletedMonster = monstersToSpawn[uuid][monsterIndex];
  monstersToSpawn[uuid].splice(monsterIndex, 1); // 몬스터 삭제
  return deletedMonster;
};

/**
 * 소환된 몬스터 목록에서 monsterId와 일치하는 몬스터 객체를 반환하는 함수
 * @param {number} uuid userId
 * @param {number} monsterId 검색할 몬스터의 인스턴스 ID
 * @returns {Monster} 검색한 몬스터 객체
 */
export const getMonsterById = (uuid, monsterId) => {
  checkMonstersExist(uuid);
  let monster = monstersToSpawn[uuid].find((monster) => monster.id === monsterId);
  // 예외처리: 몬스터를 찾지 못함
  if (!monster) throw new Error(`monster not found.`);
  return monster;
};

/**
 * 소환된 몬스터 목록이 비어있거나 정의되어있지 않은지 확인하는 예외처리 함수
 *
 * 예외 발생시 에러 반환
 * @param {number} uuid userId
 */
const checkMonstersExist = (uuid) => {
  // 예외처리: 타워 목록이 없거나 비어있음
  if (!monstersToSpawn[uuid] || monstersToSpawn[uuid].length === 0)
    throw new Error(`No monsters are spawned for user ${uuid}.`);
};
