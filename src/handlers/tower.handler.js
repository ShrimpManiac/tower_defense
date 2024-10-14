// tower.handler.js
import { Tower } from '../models/tower.model.js';

let towers = {}; // 타워 목록을 관리

// 타워 초기화
export const clearTowers = (uuid) => {
  towers[uuid] = [];
};

export const getTowers = (uuid) => {
  return towers[uuid];
};

export const setTowers = (uuid, tower) => {
  return towers[uuid].push(tower);
};

// Id로 타워 찾기
function getTowerById(uuid, towerId) {
  if (!towers[uuid] || towers[uuid].length === 0) {
    return null;
  }

  let tower = towers[uuid].find((tower) => tower.id === towerId);
  return tower;
}

// 타워 구매(배치) 핸들러
// Payload: { towerType, x, y }
export const buyTower = (uuid, payload) => {
  const { towerType, x, y } = payload;

  const newTower = new Tower(towerType, x, y);
  const cost = newTower.cost;
  const id = newTower.id;

  if (!hasEnoughGold(uuid, cost)) {
    return { status: 'fail', message: 'Not enough gold' };
  }

  const remainingGold = deductGold(uuid, cost); // 바로 sendEventToClient

  towers[uuid].push(newTower);
  const towerPacketInfo = `${id},${towerType},${remainingGold}`; // 노션의 패킷 정보 수정해야함 towerId, dataId, 남은 골드 => json.stringify

  console.log(`Buy tower successful for UUID: ${uuid}`);
  return { status: 'success', message: 'Tower purchased', towerPacketInfo: towerPacketInfo };
};

// 타워 판매 핸들러
// Payload: { towerId }
export const sellTower = (uuid, payload) => {
  const { towerId } = payload;

  if (!towers[uuid] || towers[uuid].length === 0) {
    return { status: 'fail', message: `No towers found for UUID: ${uuid}` };
  }

  const towerIndex = towers[uuid].findIndex((tower) => tower.id === towerId);
  if (towerIndex === -1) {
    return { status: 'fail', message: 'Tower not found' };
  }

  const [soldTower] = towers[uuid].splice(towerIndex, 1); // 구조 분해 할당
  const refundGold = Math.floor(soldTower.cost / 2); // 판매 시 원가의 절반 회수

  const remainingGold = addGold(uuid, refundGold); // 유저 골드에 추가하고 보유골드 반환

  const towerPacketInfo = `${remainingGold}`;

  console.log(`Sell tower successful for UUID: ${uuid}, Tower ID: ${towerId}`);
  return { status: 'success', message: 'Tower sold', towerPacketInfo: towerPacketInfo };
};

// 타워 업그레이드 핸들러
// Payload: { towerId, upgradeCost }
export const upgradeTower = (uuid, payload) => {
  const { towerId } = payload;

  if (!towers[uuid] || towers[uuid].length === 0) {
    return { status: 'fail', message: 'No towers available to upgrade' };
  }

  // 보유중인 타워에서 찾기
  const tower = towers[uuid].find((tower) => tower.id === towerId);
  if (!tower) {
    return { status: 'fail', message: 'Tower not found' };
  }

  const upgradeCost = tower.upgradeCost;
  if (!hasEnoughGold(uuid, upgradeCost)) {
    return { status: 'fail', message: 'Not enough gold' };
  }

  // 타워 업그레이드 (예: 공격력 및 범위 증가)
  const id = tower.id;
  tower.attackPower *= 1.5;
  tower.range *= 1.2;
  tower.level += 1; // 타워 레벨 증가
  tower.upgradeCost *= 1.5;

  const remainingGold = deductGold(uuid, upgradeCost);
  const towerPacketInfo = `${id},${tower.attackPower},${tower.range},${tower.level},${tower.cost},${remainingGold}`; // 노션 패킷정보 수정 (타워정보 + 남은골드 한번에 보내는걸로)

  console.log(`Upgrade tower successful for UUID: ${uuid}, Tower ID: ${towerId}`);
  return {
    status: 'success',
    message: 'Tower upgraded',
    towerPacketInfo: towerPacketInfo,
  };
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
  return remainingGold;
}

function addGold(uuid, amount) {
  // 유저의 골드를 추가하는 함수 (임시 구현)
  return remainingGold;
}
