import { Tower } from './tower.class.js';
import { SELL_PENALTY, UPGRADE_BONUS, UPGRADE_COST_SCALER } from '../constants.js';

/**
 * 일반 타워 클래스
 */
export class NormalTower extends Tower {
  constructor(assetId, spawnLocation) {
    super(assetId, spawnLocation);
  }
}

/**
 * 슬로우 타워 클래스
 */
export class SlowTower extends Tower {
  constructor(assetId, spawnLocation) {
    super(assetId, spawnLocation);
  }

  attack(monster) {
    if (this.cooldownLeft <= 0) {
      this.target = monster;

      // 몬스터 이동 속도 감소 적용
      if (monster.speed && !monster.isSlowed) {
        monster.speed *= this.skillValue; // 몬스터의 이동 속도를 감소시킴
        monster.isSlowed = true; // 슬로우 효과를 받고 있음을 표시

        // 일정 시간 후 몬스터의 속도 원상 복구
        setTimeout(() => {
          if (monster.isSlowed) {
            monster.speed /= this.skillValue;
            monster.isSlowed = false;
          }
        }, this.skillDuration * 1000); // 초 단위로
      }

      this.cooldownLeft = this.cooldown; // 공격 후 쿨타임 초기화
    }
  }

  applyUpgrades() {
    // 비용 상승
    this.sellCost += this.upgradeCost * SELL_PENALTY;
    this.upgradeCost *= UPGRADE_COST_SCALER;

    // 타워 강화
    this.attackPower *= UPGRADE_BONUS[this.level].attack_bonus;
    this.range *= UPGRADE_BONUS[this.level].range_bonus;

    // 레벨 상승
    this.level++;

    this.skillValue += 0.1; // 슬로우 율 10% 씩 증가
    this.skillDuration += 0.5; // 스킬 지속시간 0.5초씩 증가
  }
}

export class MultiTower extends Tower {
  constructor(assetId, spawnLocation) {
    super(assetId, spawnLocation);
  }

  attack(monster) {
    if (this.cooldownLeft <= 0) {
      this.target = monster;

      // 몬스터 이동 속도 감소 적용
      if (monster.speed && !monster.isSlowed) {
        monster.speed *= this.skillValue; // 몬스터의 이동 속도를 감소시킴
        monster.isSlowed = true; // 슬로우 효과를 받고 있음을 표시

        // 일정 시간 후 몬스터의 속도 원상 복구
        this.applySkillEffect(monster);
      }

      this.cooldownLeft = this.cooldown; // 공격 후 쿨타임 초기화
    }
  }

  applySkillEffect(monster) {
    setTimeout(() => {
      if (monster.isSlowed) {
        monster.speed /= this.skillValue;
        monster.isSlowed = false;
      }
    }, this.skillDuration * 1000); // 초 단위로
  }

  applyUpgrades() {
    // 비용 상승
    this.sellCost += this.upgradeCost * SELL_PENALTY;
    this.upgradeCost *= UPGRADE_COST_SCALER;

    // 타워 강화
    this.attackPower *= UPGRADE_BONUS[this.level].attack_bonus;
    this.range *= UPGRADE_BONUS[this.level].range_bonus;

    // 레벨 상승
    this.level++;

    this.skillValue++; // 멀티 타겟 1 증가
  }
}
