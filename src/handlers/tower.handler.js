// tower.handler.js

// 해야할 것
// tower 상속받기 (슬로우 대공타워)
// client에서 받는 코드 만들기
// 배치시 위치 유효한지 체크
// 구매와 배치 나누기 (무료타워 배치 고려)
// 함수에 ** 코드 컨벤션 맞추기

import { deleteTower, setTower, Tower } from '../models/tower.model.js';
import { hasSufficientBalance, withdrawAccount, depositAccount } from './account.handler.js';

/**
 * 타워 구매(설치) 핸들러
 *
 * 수신 payload : { assetId, spawnLocation }
 *
 * 발신 payload : { instanceId }
 * @param {number} uuid userId
 * @param {json} payload 데이터
 * @returns {{status: string, message: string, payload: json}}
 */
export const buyTower = (uuid, payload) => {
  try {
    const { towerId, spawnLocation } = payload;

    // INCOMPLETE: 설치 좌표가 적합한지 검증

    // 타워 생성
    const newTower = new Tower(towerId, spawnLocation);

    // 골드가 충분한지 검증
    if (!hasSufficientBalance(uuid, newTower.buyCost)) {
      return { status: 'fail', message: 'Not enough gold' };
    }

    // 골드 차감
    const withdrawalResult = withdrawAccount(uuid, newTower.buyCost);

    // 예외처리: 출금 실패
    if (withdrawalResult.status != 'success') {
      console.log(withdrawalResult.message);
      return { status: 'fail', message: withdrawalResult.message };
    }

    // (서버) 타워 설치
    setTower(uuid, newTower);

    // 결과 반환
    console.log(`Tower Purchase successful for UUID: ${uuid}`);
    return { status: 'success', message: 'Tower successfully purchased', payload: newTower.id };

    // 예외처리: 상정하지 못한 오류
  } catch (err) {
    console.error(err.message);
    return { status: 'fail', message: err.message };
  }
};

// 타워 판매 핸들러
// Payload: { towerId }
export const sellTower = (uuid, payload) => {
  const { towerId } = payload;

  // 타워 삭제
  const soldTower = deleteTower(uuid, towerId);

  const refundGold = soldTower.sellPrice;

  const remainingGold = depositAccount(uuid, refundGold); // 유저 골드에 추가하고 보유골드 반환

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
  if (!hasSufficientBalance(uuid, upgradeCost)) {
    return { status: 'fail', message: 'Not enough gold' };
  }

  // 타워 업그레이드 (예: 공격력 및 범위 증가) 함수화 고민
  const id = tower.id;
  tower.attackPower *= 1.5;
  tower.range *= 1.2;
  tower.level += 1; // 타워 레벨 증가
  tower.upgradeCost *= 1.5;

  const remainingGold = withdrawAccount(uuid, upgradeCost);
  const towerPacketInfo = `${id},${tower.attackPower},${tower.range},${tower.level},${tower.cost},${remainingGold}`; // 노션 패킷정보 수정 (타워정보 + 남은골드 한번에 보내는걸로)

  console.log(`Upgrade tower successful for UUID: ${uuid}, Tower ID: ${towerId}`);
  return {
    status: 'success',
    message: 'Tower upgraded',
    towerPacketInfo: towerPacketInfo,
  };
};

/**
 * 클라이언트로부터의 몬스터 공격 요청을 처리하는 핸들러
 *
 * 공격 로직 (monster.attack) 처리 후 몬스터 사망여부 판단
 *
 * 생존 시 몬스터 정보수정 명령 패킷 전송 / 사망 시 몬스터 삭제 명령 패킷 전송
 * @param {uuid} number userId
 * @param {*} payload 데이터
 */
export const attackMonster = (uuid, payload) => {
  const { monsterId, towerId } = payload;
};
