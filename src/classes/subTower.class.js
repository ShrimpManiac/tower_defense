import { Tower } from '../tower.class.js';

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
}
