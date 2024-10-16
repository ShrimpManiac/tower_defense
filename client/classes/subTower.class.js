import { Tower } from './tower.class.js';
import { ASSET_TYPE, SELL_PENALTY, UPGRADE_BONUS, UPGRADE_COST_SCALER } from '../constants.js';
import { findAssetDataById } from '../utils/assets.js';

/**
 * 일반 타워 클래스
 */
export class NormalTower extends Tower {
  constructor(assetId, instanceId, spawnLocation) {
    super(assetId, instanceId, spawnLocation);
  }
}

/**
 * 슬로우 타워 클래스
 */
export class SlowTower extends Tower {
  constructor(assetId, instanceId, spawnLocation) {
    super(assetId, instanceId, spawnLocation);
    const towerData = findAssetDataById(ASSET_TYPE.TOWER, assetId);
    this.towerImage = new Image();
    this.towerImage.src = towerData.image;
  }

  drawBeam(ctx) {
    if (this.remainingBeamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.remainingBeamDuration--;
    }
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
      this.remainingBeamDuration = 30;
    }
  }
}

export class MultiTower extends Tower {
  constructor(assetId, instanceId, spawnLocation) {
    super(assetId, instanceId, spawnLocation);
    const towerData = findAssetDataById(ASSET_TYPE.TOWER, assetId);
    this.towerImage = new Image();
    this.towerImage.src = towerData.image;

    this.targets = [];
  }

  drawBeam(ctx, target) {
    if (this.remainingBeamDuration > 0 && target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(target.x + target.width / 2, target.y + target.height / 2);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.remainingBeamDuration--;
    }
  }
}
