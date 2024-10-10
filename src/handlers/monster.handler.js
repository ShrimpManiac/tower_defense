import MonsterModel from '../models/monster.model.js';
const monsters = []; // 몬스터 목록

export const spawnMonster = (path, level) => {
  const monster = new MonsterModel(path, level);
  monsters.push(monster);
  return monster.getMonsterData(); // 몬스터 데이터를 클라이언트로 보냄
};

export const moveMonsters = (base) => {
  monsters.forEach((monster, index) => {
    const isDestroyed = monster.move(base);
    if (isDestroyed || monster.hp <= 0) {
      monsters.splice(index, 1); // 소멸된 몬스터 삭제
    }
  });

  return monsters.map((monster) => monster.getMonsterData()); // 업데이트된 몬스터 데이터 반환
};
