import { ASSET_TYPE, UPGRADE_BONUS } from '../constants.js';
import { findAssetDataById } from '../utils/assets.js';

export class Tower {
  /**
   * @param {Number} assetId 타워 애셋 ID (데이터테이블 조회용)
   * @param {Number} instanceId 타워 인스턴스 ID (서버에서 수신)
   * @param {{x: Number, y: Number}} spawnLocation 설치 좌표
   */
  constructor(assetId, instanceId, spawnLocation) {
    let towerData = findAssetDataById(ASSET_TYPE.TOWER, assetId);
    /**
     * 타워 인스턴스 ID
     */
    this.id = instanceId;

    this.attackPower = towerData.damage; // 타워 공격력
    this.range = towerData.range; // 타워 사거리
    this.beamDuration = towerData.beamDuration; // 타워 광선 지속 시간
    this.cooldown = towerData.cooldown; // 타워 공격 쿨타임
    this.cost = towerData.cost; // 타워 구입 비용
    this.skill = towerData.skill; // 타워 타입

    this.target = null; // 타워 광선의 목표
    this.level = 1; // 타워 업그레이드 레벨

    this.x = spawnLocation.x; // 타워 x 위치
    this.y = spawnLocation.y; // 타워 y 위치

    this.image = towerData.image; // 타워 이미지
    this.width = towerData.width; // 타워 이미지 가로 크기
    this.height = towerData.height; // 타워 이미지 세로 크기
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
