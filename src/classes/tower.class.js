import { ASSET_TYPE } from '../constants';
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

    // 업그레이드 레벨 및 비용
    this.level = 1;
    this.buyCost = towerData.cost; // 구매 비용
    this.upgradeCost = Math.floor(this.buyCost * 1.5); // 업그레이드 비용
    // INCOMPLETE : 판매 가격

    // 현재 타겟
    this.target = null; // 타워 광선의 목표
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
  }

  updateCooldown() {
    if (this.cooldownLeft > 0) {
      this.cooldownLeft--;
    }
  }
}
