import { ASSET_TYPE, SELL_PENALTY, UPGRADE_BONUS, UPGRADE_COST_SCALER } from '../constants';
import { findAssetDataById } from '../init/assets';

export class Tower {
  static instanceId = 0;

  /**
   * @param {Number} assetId 타워 애셋 ID (데이터테이블 조회용)
   * @param {{x: Number, y: Number}} spawnLocation 설치 좌표
   */
  constructor(assetId, spawnLocation) {
    const towerData = findAssetDataById(ASSET_TYPE.TOWER, assetId);
    const skillData = findAssetDataById(ASSET_TYPE.TOWER_SKILL, towerData.skillId);
    /**
     * 타워 인스턴스 ID
     */
    this.id = Tower.instanceId++;

    // 타워 위치
    this.x = spawnLocation.x; // x 좌표
    this.y = spawnLocation.y; // y 좌표

    // 타워 크기
    this.width = towerData.width; // 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = towerData.height; // 이미지 세로 길이

    // 기본스탯
    this.attackPower = towerData.attackPower; // 공격력
    this.range = towerData.range; // 사거리

    // 공격 쿨타임
    this.cooldown = towerData.cooldown; // 공격 쿨타임 (1초당 60프레임)
    this.cooldownLeft = 0; // 남은 쿨타임

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
  }

  attack(monster) {
    // 대공 체크
    if (monster.type === 'flying' && this.antiAir === false) {
      console.log(`Tower ${this.id} 대공 공격 실패`);
      return;
    }

    // 사거리 체크
    // INCOMPLETE : withinRange 함수 미구현
    if (!withinRange(tower, monster)) {
      return { status: 'failure', message: 'Monster not within range' };
    }

    // 쿨타임 체크
    if (this.cooldownLeft > 0) {
      console.log(`Tower ${this.id} 공격 쿨타임`);
      return;
    }

    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    monster.hp -= this.attackPower; // 몬스터 체력 감소
    this.cooldownLeft = this.cooldown; // 공격 쿨타임 시작
    this.target = monster; // 광선의 목표 설정
    this.remainingBeamDuration = BEAM_DURATION; // 광선 애니메이션 가동 (남은시간 0초 -> 0.5초)
  }

  updateCooldown() {
    if (this.cooldownLeft > 0) {
      this.cooldownLeft--;
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

    // INCOMPLETE : 특수타워 업그레이드 차별화
  }
}
