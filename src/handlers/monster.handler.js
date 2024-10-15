import MonsterModel from '../models/monster.model.js';
import { findAssetDataById } from '../init/assets.js';
import { ASSET_TYPE } from '../constants.js';

const monsters = []; // 몬스터 목록

// 몬스터 소환
export const spawnMonster = (path, monsterId) => {
  const monsterData = findAssetDataById(ASSET_TYPE.MONSTER, monsterId); // 몬스터 ID로 몬스터 데이터를 찾음

  if (!monsterData) {
    throw new Error(`몬스터 데이터를 찾을 수 없습니다. ID: ${monsterId}`);
  }

  // 몬스터 데이터를 기반으로 몬스터 생성
  const monster = new MonsterModel(path, monsterData);
  monsters.push(monster);
  return monster.getMonsterData(); // 클라이언트로 몬스터 데이터를 반환
};

// 몬스터 이동
export const moveMonsters = (base) => {
  monsters.forEach((monster, index) => {
    const isDestroyed = monster.move(base);
    if (isDestroyed || monster.hp <= 0) {
      monsters.splice(index, 1); // 소멸된 몬스터 삭제
    }
  });

  return monsters.map((monster) => monster.getMonsterData()); // 업데이트된 몬스터 데이터 반환
};
