import { Monster } from '../classes/monster.class.js';
import {
  monsterSpawnQueue,
  spawnedMonsters,
  clearMonsters,
  addToSpawnQueue,
} from '../models/monster.model.js';
import { findAssetDataById } from '../utils/assets.js';
import { ASSET_TYPE } from '../constants.js';
import { monsterPaths } from '../src/game.js';

/**
 * 몬스터 소환 핸들러
 *
 * 수신 payload : { monsterId, pathIndex }
 *
 * 발신 payload : { }
 * @param {json} payload 데이터
 * @returns {{status: string, message: string}}
 * @returns
 */
export const spawnMonster = (payload) => {
  const { monsterId: instanceId, pathIndex } = payload;

  const assetId = monsterSpawnQueue.shift(); // 몬스터 큐에서 소환할 몬스터 ID를 가져옴
  const monsterData = findAssetDataById(ASSET_TYPE.MONSTER, assetId); // 몬스터 데이터 불러오기

  const randomPath = monsterPaths[pathIndex];

  const monster = new Monster(assetId, instanceId, randomPath); // Monster 인스턴스 생성
  spawnedMonsters.push(monster); // 생성된 몬스터 인스턴스를 배열에 추가
};

/**
 * 스테이지 시작 시 몬스터 소환 큐를 초기화하고 몬스터를 소환하는 함수
 * @param {number} stageId 시작할 스테이지 ID
 * @param {number[]} spawnQueue 소환할 몬스터들의 순서 (몬스터 애셋 ID의 배열)
 */
export const initSpawnQueue = (stageId, spawnQueue) => {
  clearMonsters; // 스테이지마다 초기화

  // 소환할 몬스터 목록 업데이트
  for (let monsterId = 0; monsterId < spawnQueue.length; monsterId++) {
    addToSpawnQueue(monsterId);
  }

  // 마지막 스테이지 보스 출현
  if (stageId === 4005) {
    monsterSpawnQueue.push(3004);
  }
};
