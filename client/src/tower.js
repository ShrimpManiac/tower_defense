import { ASSET_TYPE, UPGRADE_BONUS } from '../constants.js';
import { findAssetDataById } from '../utils/assets.js';

export class Tower {
  /**
   * @param {Number} assetId 타워 애셋 ID (데이터테이블 조회용)
   * @param {Number} instanceId 타워 인스턴스 ID (서버에서 수신)
   * @param {{x: Number, y: Number}} spawnLocation 설치 좌표
   */
  constructor(assetId, instanceId, spawnLocation) {
    const towerData = findAssetDataById(ASSET_TYPE.TOWER, assetId);
    const skillData = findAssetDataById(ASSET_TYPE.TOWER_SKILL, towerData.skillId);
    /**
     * 타워 인스턴스 ID
     */
    this.id = instanceId;

    // 타워 위치
    this.x = spawnLocation.x; // x 좌표
    this.y = spawnLocation.y; // y 좌표

    // 타워 이미지 및 크기
    this.image = towerData.image; // 이미지
    this.width = towerData.width; // 이미지 가로 크기
    this.height = towerData.height; // 이미지 세로 크기

    // 기본스탯
    this.attackPower = towerData.attackPower; // 공격력
    this.range = towerData.range; // 사거리

    // 공격 쿨타임
    this.cooldown = towerData.cooldown; // 공격 쿨타임
    this.cooldownLeft = 0; // 남은 쿨타임
    this.beamDuration = 0; // 광선 애니메이션 남은 지속 시간

    // 특수타워 스킬
    this.skillDuration = skillData.skillDuration; // 스킬 지속 시간
    this.skillValue = skillData.skillValue; // 스킬로 인해 감소되는 이동 속도 비율 (0.5는 50% 감소 의미)
    this.antiAir = skillData.anti_air; // 공중 유닛 공격 가능 여부

    // 업그레이드 레벨 및 비용
    this.level = 1;
    this.buyCost = towerData.cost; // 구매 비용
    this.upgradeCost = Math.floor(cost * 1.5); // 업그레이드 비용
    // INCOMPLETE : 판매 가격

    // 현재 타겟
    this.target = null;
  }

  draw(ctx, towerImage) {
    ctx.drawImage(towerImage, this.x, this.y, this.width, this.height);
    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
      ctx.strokeStyle = 'skyblue';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
  }

  attack(monster) {
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower;
      this.cooldown = 180; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = 30; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}
