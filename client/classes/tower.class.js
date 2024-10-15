import { ASSET_TYPE, SELL_PENALTY, UPGRADE_BONUS, UPGRADE_COST_SCALER } from '../constants.js';
import { findAssetDataById } from '../utils/assets.js';

// 클라이언트 Tower Class
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
    this.assetId = assetId;

    // 타워 크기
    this.width = towerData.width; // 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = towerData.height; // 이미지 세로 길이

    // 타워 위치
    this.x = spawnLocation.x - this.width / 2; // x 좌표
    this.y = spawnLocation.y - this.height / 2; // y 좌표

    // 기본스탯
    this.attackPower = towerData.attackPower; // 공격력
    this.range = towerData.range; // 사거리

    // 공격 쿨타임
    this.cooldown = towerData.cooldown; // 공격 쿨타임 (1초당 60프레임)
    this.cooldownLeft = 0; // 남은 쿨타임
    this.remainingBeamDuration = 30;

    // 특수타워 스킬
    this.skillDuration = skillData.skillDuration; // 스킬 지속 시간
    this.skillValue = skillData.skillValue; // 스킬로 인해 감소되는 이동 속도 비율 (0.5는 50% 감소 의미)
    this.antiAir = skillData.anti_air; // 공중 유닛 공격 가능 여부

    // 구매, 판매, 업그레이드 비용
    this.buyCost = towerData.cost; // 구매 비용
    this.sellPrice = Math.floor(this.buyCost * SELL_PENALTY); // 판매 가격
    this.upgradeCost = Math.floor(this.buyCost * UPGRADE_COST_SCALER); // 업그레이드 비용

    // 현재 업그레이드 레벨
    this.level = 1;

    // 현재 타겟
    this.target = null; // 타워 광선의 목표

    this.towerImage = new Image();
    this.towerImage.src = towerData.image;
  }

  draw(ctx) {
    ctx.drawImage(this.towerImage, this.x, this.y, this.width, this.height);
  }

  drawBeam(ctx) {
    if (this.remainingBeamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
      ctx.strokeStyle = 'skyblue';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.remainingBeamDuration--;
    }
  }

  attack(monster) {
    // 대공 체크
    if (monster.type === 'flying' && this.antiAir === false) {
      console.log(`Tower ${this.id} 대공 공격 실패`);
      return;
    }

    // 쿨타임 체크
    if (this.cooldownLeft > 0) {
      console.log(`Tower ${this.id} 공격 쿨타임`);
      return;
    }
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    //
    monster.hp -= this.attackPower;
    this.cooldownLeft = this.cooldown;
    this.target = monster; // 광선의 목표 설정
    this.remainingBeamDuration = 30;
  }

  updateCooldown() {
    if (this.cooldownLeft > 0) {
      this.cooldownLeft--;
    }
  }

  applyUpgrades(payload) {
    const dataString = payload.towerInfo;
    const dataArray = dataString.split(',').map(Number);
    // 배열의 각 값을 변수로 할당
    const [level, attackPower, range, upgradeCost, sellCost, skillDuration, skillValue] = dataArray;

    this.level = level;
    this.attackPower = attackPower;
    this.range = range;
    this.upgradeCost = upgradeCost;
    this.sellCost = sellCost;
    this.skillDuration = skillDuration;
    this.skillValue = skillValue;
  }
}
