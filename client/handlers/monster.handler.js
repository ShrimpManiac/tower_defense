import { Monster } from '../classes/monster.class.js';
import { monstersToSpawn, spawnedMonsters, clearMonsters } from '../models/monster.model.js';
import { findAssetDataById } from '../utils/assets.js';
import { ASSET_TYPE } from '../constants.js';
import { monsterPaths } from '../src/game.js';

let spawnIntervalId; // 소환 타이머

/**
 * 클라이언트의 요청에 따라 몬스터를 소환하는 함수
 * @param {number} instanceId 서버에서 받은 몬스터 인스턴스 ID
 * @param {{x: number, y: number}[]} paths 몬스터 경로
 * @returns
 */
export const spawnMonster = (instanceId) => {
  if (monstersToSpawn.length === 0) {
    clearInterval(spawnIntervalId); // 더 이상 소환할 몬스터가 없으면 타이머 중단
    return;
  }
  const monsterId = monstersToSpawn.shift(); // 몬스터 큐에서 소환할 몬스터 ID를 가져옴
  const monsterData = findAssetDataById(ASSET_TYPE.MONSTER, monsterId); // 몬스터 데이터 불러오기

  // 여러 몬스터 경로 중 하나를 랜덤 선택
  const randomPath = monsterPaths[Math.floor(Math.random() * monsterPaths.length)];

  const monster = new Monster(monsterData.id, instanceId, randomPath); // Monster 인스턴스 생성
  spawnedMonsters.push(monster); // 생성된 몬스터 인스턴스를 배열에 추가
};

/**
 * 몬스터 소환 타이머를 시작하여 몬스터 소환을 시작하는 함수
 */
export const startSpawningMonsters = () => {
  spawnIntervalId = setInterval(spawnMonster, 1000); // 1초마다 스폰
};

/**
 * 스테이지 시작 시 몬스터 소환 큐를 초기화하고 몬스터를 소환하는 함수
 * @param {number} StageId
 */
export const initSpawnQueue = (StageId) => {
  clearMonsters; // 스테이지마다 초기화
  let stageData = findAssetDataById(ASSET_TYPE.STAGE, StageId);
  // 변수 설정
  let monsterIds = stageData.monsterIds;
  let numMonsters = stageData.numMonsters;
  let monsterProbabilitys = stageData.monsterProbabilitys;

  //랜덤으로 monstersToSpawn에 monseterId를 넣는 반복문
  for (let i = 0; i < numMonsters; i++) {
    const rand = Math.random(); // 랜덤함수
    let cumulativeRate = 0; // 누적확률
    // monsterProbabilitys에 따라 몬스터 선택
    for (let j = 0; j < monsterIds.length; j++) {
      cumulativeRate += monsterProbabilitys[j];
      if (rand < cumulativeRate) {
        let monsterId = monsterIds[j];
        monstersToSpawn.push(monsterId);
        break;
      }
    }
  }
  // 마지막 스테이지 보스 출현
  if (StageId === 4005) {
    monstersToSpawn.push(3004);
  }
  startSpawningMonsters();
};
