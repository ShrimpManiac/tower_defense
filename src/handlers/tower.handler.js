// tower.handler.js
import { Tower } from '../models/tower.model.js';

let towers = {}; // 타워 목록을 관리

export const getTowers = () => towers;

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
