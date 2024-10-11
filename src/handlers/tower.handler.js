// tower.handler.js
import { Tower } from '../models/tower.model.js';

let towers = {}; // 타워 목록을 관리

// 타워 초기화
export const clearTowers = (uuid) => {
  stages[uuid] = [];
};

export const getTowers = (uuid) => {
  return towers[uuid];
};

export const setTowers = (uuid, tower) => {
  return stages[uuid].push({ tower });
};

// 타워 구매(배치) 핸들러
// Payload: { towerType, x, y }
export const buyTower = (uuid, payload) => {
  const { towerType, x, y } = payload;

  if (!hasEnoughGold(uuid, cost)) {
    return { status: 'fail', message: 'Not enough gold' };
  }

  const newTower = new Tower(towerType, x, y);
  const towerPacketInfo = `${id},${towerType},${gold}`;
  towers[uuid].push(newTower);
  deductGold(uuid, gold); // 바로 handleEmitEvent
  console.log(`Buy tower successful for UUID: ${uuid}`);
  return { status: 'success', message: 'Tower purchased', towerPacketInfo: towerPacketInfo };
};

// 타워 판매 핸들러
// Payload: { towerId }
export const sellTower = (uuid, payload) => {
  const { towerId } = payload;

  if (!towers[uuid] || towers[uuid].length === 0) {
    return { status: 'fail', message: 'No towers to sell' };
  }

  const towerIndex = towers[uuid].findIndex((tower) => tower.id === towerId);
  if (towerIndex === -1) {
    return { status: 'fail', message: 'Tower not found' };
  }

  const [soldTower] = towers[uuid].splice(towerIndex, 1); // 구조 분해 할당
  const refundGold = int(soldTower.cost / 2); // 판매 시 원가의 절반 회수
  addGold(uuid, refundGold); // 아니면 여기서 반환값으로 남은 골드를 받기? remainGold = addgold(uuid, goldReceived)
  remainGold = getGold();
  console.log(`Sell tower successful for UUID: ${uuid}, Tower ID: ${towerId}`);
  return { status: 'success', message: 'Tower sold', reaminGold: remainGold };
};

// Helper functions (for managing gold)
function hasEnoughGold(uuid, amount) {
  // gold.model.js 에서 현재 골드값 가져오기 getGold
  // 현재 골드 - amount >= 0 이면 true 아니면 false
  return true; // 실제로는 유저의 골드 상태를 확인해야 합니다.
}

function deductGold(uuid, amount) {
  // currentGold = gold.getGold()
  // finalGold = currentGold - amount;
  // gold.setGold(finalGold);
}

function addGold(uuid, amount) {
  // 유저의 골드를 추가하는 함수 (임시 구현)
}
