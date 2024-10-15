import { Monster } from '../classes/monster.class.js';
import {
  monstersToSpawn,
  spawnedMonsters,
  setMonster,
  clearMonsters,
  addToSpawnQueue,
} from '../models/monster.model.js';
import { findAssetDataById } from '../init/assets.js';
import { ASSET_TYPE } from '../constants.js';
import { sendEventToClient } from '../handlers/helper.js';

let spawnIntervalId; // 소환 타이머

/**
 * 소환 타이머가 울릴 떄 자동으로 실행되어 서버 내 몬스터 소환로직을 처리하고 클라이언트에게
 * 몬스터 소환 명령 이벤트를 발생시키는 함수
 * @param {*} uuid userId
 * @param {*} assetId 소환할 몬스터 애셋ID
 * @param {*} path 몬스터 이동경로
 * @returns
 */
export const spawnMonster = (uuid, path) => {
  const monsterId = monstersToSpawn.shift(); // 몬스터 큐에서 소환할 몬스터 ID를 가져옴
  // 서버 내 몬스터 생성
  let monster = new Monster(monsterId, path);
  setMonster(uuid, monster);
  const response = sendEventToClient(31, { monsterId: monster.id });
  if (response.status === 'failure')
    throw new Error(`user ${uuid} failed to spawn monster ${monster.id}`);
};

/**
 * 몬스터 소환 타이머를 시작하여 몬스터 소환을 시작하는 함수
 * @param {number} uuid userId
 */
export const startSpawningMonsters = (uuid) => {
  const monsterPath1 = findAssetDataById(ASSET_TYPE.PATH, 5001).path;
  const monsterPath2 = findAssetDataById(ASSET_TYPE.PATH, 5002).path;
  const monsterPath3 = findAssetDataById(ASSET_TYPE.PATH, 5003).path;
  const monsterPaths = [monsterPath1, monsterPath2, monsterPath3];

  // 여러 몬스터 경로 중 하나를 랜덤 선택
  const randomPath = monsterPaths[Math.floor(Math.random() * monsterPaths.length)];

  spawnIntervalId = setInterval(spawnMonster(uuid, randomPath), 1000); // 1초마다 스폰
};

/**
 * 스테이지 시작 시 몬스터 소환 큐를 초기화하고 몬스터를 소환하는 함수
 * @param {number} uuid userId
 * @param {number} StageId 시작할 스테이지 ID
 */
export const initSpawnQueue = (uuid, StageId) => {
  clearMonsters; // 스테이지마다 초기화
  let stageData = findAssetDataById(ASSET_TYPE.STAGE, StageId);
  // 변수 설정
  const { monsterIds, numMonsters, monsterProbabilitys } = stageData;

  //랜덤으로 monstersToSpawn에 monseterId를 넣는 반복문
  for (let i = 0; i < numMonsters; i++) {
    const rand = Math.random(); // 랜덤함수
    let cumulativeRate = 0; // 누적확률
    // monsterProbabilitys에 따라 몬스터 선택
    for (let j = 0; j < monsterIds.length; j++) {
      cumulativeRate += monsterProbabilitys[j];
      if (rand < cumulativeRate) {
        let monsterId = monsterIds[j];
        addToSpawnQueue(uuid, monsterId);
        break;
      }
    }
  }
  // 마지막 스테이지 보스 출현
  if (StageId === 4005) {
    addToSpawnQueue(uuid, 3004);
  }
};
