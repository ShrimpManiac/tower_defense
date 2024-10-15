import { Monster } from '../classes/monster.class.js';
import { monstersToSpawn, spawnedMonsters } from '../models/monster.model.js';
import { findAssetDataById } from '../utils/assets.js';
import { ASSET_TYPE } from '../constants.js';

/**
 * 클라이언트의 요청에 따라 몬스터를 소환하는 함수
 * @param {number} instanceId 서버에서 받은 몬스터 인스턴스 ID
 * @param {{x: number, y: number}[]} paths 몬스터 경로
 * @param {*} spawnIntervalId 소환 타이머
 * @returns
 */
export const spawnMonster = (instanceId, paths, spawnIntervalId) => {
  if (monstersToSpawn.length === 0) {
    clearInterval(spawnIntervalId); // 더 이상 소환할 몬스터가 없으면 타이머 중단
    return;
  }
  const monsterId = monstersToSpawn.shift(); // 몬스터 큐에서 소환할 몬스터 ID를 가져옴
  const monsterData = findAssetDataById(ASSET_TYPE.MONSTER, monsterId); // 몬스터 데이터 불러오기

  // 여러 몬스터 경로 중 하나를 랜덤 선택
  const randomPath = paths[Math.floor(Math.random() * paths.length)];

  const monster = new Monster(monsterData.id, instanceId, randomPath); // Monster 인스턴스 생성
  spawnedMonsters.push(monster); // 생성된 몬스터 인스턴스를 배열에 추가
};
