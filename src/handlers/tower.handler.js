// tower.handler.js

// 해야할 것
// client에서 받는 코드 만들기
// 배치시 위치 유효한지 체크
// 구매와 배치 나누기 (무료타워 배치 고려)
// 함수에 ** 코드 컨벤션 맞추기
import { Tower } from '../classes/tower.class.js';
import { deleteTower, getTowerById, setTower } from '../models/tower.model.js';
import { hasSufficientBalance, withdrawAccount, depositAccount } from './account.handler.js';
import { updateIncreaseScore } from './score.handler.js';
// INCOMPLETE: import monster (몬스터 클래스가 미구현)

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
      return { status: 'failure', message: 'Not enough gold.' };
    }

    // 골드 차감
    const withdrawalResult = withdrawAccount(uuid, newTower.buyCost);

    // 예외처리: 출금 실패
    if (withdrawalResult.status != 'success') {
      console.log(withdrawalResult.message);
      return { status: 'failure', message: withdrawalResult.message };
    }

    // (서버) 타워 설치
    setTower(uuid, newTower);

    // 결과 반환
    const message = `Tower Purchase successful for UUID: ${uuid}, Tower ID: ${towerId}.`;
    console.log(message);
    return {
      status: 'success',
      message: message,
      payload: { towerId: newTower.id },
    };

    // 예외처리: 상정하지 못한 오류
  } catch (err) {
    console.error(err.message);
    return { status: 'failure', message: err.message };
  }
};

/**
 * 타워 판매 핸들러
 *
 * 수신 payload : { instanceId }
 *
 * 발신 payload : { }
 * @param {number} uuid userId
 * @param {json} payload 데이터
 * @returns {{status: string, message: string, payload: json}}
 */
export const sellTower = (uuid, payload) => {
  try {
    const { towerId } = payload;

    // 타워 삭제
    const sellPrice = deleteTower(uuid, towerId);

    // 골드 가산
    depositAccount(uuid, sellPrice);

    // 결과 반환
    const message = `Sell tower successful for UUID: ${uuid}, Tower ID: ${towerId}.`;
    console.log(message);
    return { status: 'success', message: message };

    // 예외처리: 상정하지 못한 오류
  } catch (err) {
    console.error(err.message);
    return { status: 'failure', message: err.message };
  }
};

/**
 * 타워 업그레이드 핸들러
 *
 * 수신 payload : { instanceId }
 *
 * 발신 payload : { towerInfo string }
 * @param {number} uuid userId
 * @param {json} payload 데이터
 * @returns {{status: string, message: string, payload: json}}
 */
export const upgradeTower = (uuid, payload) => {
  try {
    const { towerId } = payload;

    // 업그레이드할 타워 검색
    const tower = getTowerById(uuid, towerId);

    // 골드가 충분한지 검증
    const upgradeCost = tower.upgradeCost;
    if (!hasSufficientBalance(uuid, upgradeCost)) {
      return { status: 'failure', message: `Not enough gold to upgrade tower ${tower.id}` };
    }

    // 골드 차감
    const withdrawalResult = withdrawAccount(uuid, upgradeCost);

    // 예외처리: 출금 실패
    if (withdrawalResult.status != 'success') {
      console.log(withdrawalResult.message);
      return { status: 'failure', message: withdrawalResult.message };
    }

    // 타워 업그레이드
    tower.applyUpgrades();

    // 결과 반환
    const updatedTowerInfo = `${tower.level},${tower.attackPower},${tower.range},${tower.upgradeCost},${tower.sellCost},${tower.skillDuration},${tower.skillValue}`;
    const message = `Upgrade tower successful for UUID: ${uuid}, Tower ID: ${towerId}.`;
    console.log(message);
    return {
      status: 'success',
      message: message,
      payload: { towerInfo: updatedTowerInfo },
    };

    // 예외처리: 상정하지 못한 오류
  } catch (err) {
    console.error(err.message);
    return { status: 'failure', message: err.message };
  }
};

/**
 * 몬스터 공격 핸들러
 *
 * 수신 payload : { monsterId, towerId }
 *
 * 발신 payload : { killed, monsterInfo string }
 * @param {number} uuid userId
 * @param {json} payload 데이터
 * @returns {{status: string, message: string, payload: json}}
 * @param {uuid} number userId
 * @param {json} payload 데이터
 */
export const attackMonster = (uuid, payload) => {
  try {
    const { monsterId, towerId } = payload;

    // 공격할 타워 검색
    const tower = getTowerById(uuid, towerId);

    // 공격받을 몬스터 검색
    // INCOMPLETE : getMonsterById 함수 미구현
    const monster = getMonsterById(uuid, monsterId);

    // 공격 로직 처리
    tower.attack(monster);

    // 몬스터 사망시:
    if (monster.hp <= 0) {
      // 몬스터 사망처리
      // INCOMPLETE: deleteMonster 함수 미구현
      deleteMonster(uuid, monsterId);

      // 유저 점수 가산
      updateIncreaseScore(uuid, monster.score);

      // 유저 골드 가산
      depositAccount(uuid, monster.goldDrop);

      // 결과 반환
      const message = `Monster ${monsterId} was killed by tower ${towerId}.`;
      return {
        status: 'success',
        message: message,
        payload: { killed: true },
      };

      // 몬스터 생존시:
    } else {
      // 결과 반환
      const updatedMonsterInfo = `${monster.maxHp},${monster.defense},${monster.speed}`;
      const message = `Monster ${monsterId} was attacked by tower ${towerId}.`;
      return {
        status: 'success',
        message: message,
        payload: { killed: false, monsterInfo: updatedMonsterInfo },
      };
    }
    // 예외처리: 상정하지 못한 오류
  } catch (err) {
    console.error(err.message);
    return { status: 'failure', message: err.message };
  }
};
