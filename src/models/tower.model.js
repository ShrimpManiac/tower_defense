import { ASSET_TYPE, TOWER_TYPE } from '../constants';
import { findAssetDataById } from '../init/assets';

/**
 * 게임에서 사용되는 타워의 상위 클래스입니다.
 *
 * @class
 */
export class Tower {
  static id = 0;
  /**
   * 타워의 생성자
   *
   * @constructor
   * @param {number} towerType 타워의 종류 1001 / 1002 / 1003
   * @param {number} x 타워의 x 좌표
   * @param {number} y 타워의 y 좌표
   */
  constructor(towerType, x, y) {
    this.id = id++;
    this.towerType = towerType;
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.level = 1; // 타워 레벨
    this.target = null; // 타워 광선의 목표

    const towerData = findAssetDataById(ASSET_TYPE.TOWER, towerType);
    this.width = towerData.width; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = towerData.height; // 타워 이미지 세로 길이
    this.attackPower = towerData.attackPower; // 타워 공격력
    this.range = towerData.range; // 타워 사거리
    this.cooldown = 0; // 타워 공격 쿨타임
    this.initialCooldown = towerData.cooldown;
    this.beamDuration = towerData.beamDuration; // 타워 광선 지속 시간
    this.buyCost = towerData.cost; // 타워 구입 비용
    this.upgradeCost = Math.floor(cost * 1.5);
    this.skillId = towerData.skillId;
    this.image = towerData.image;

    const skillData = findAssetDataById(ASSET_TYPE.TOWER_SKILL, skillId);
    this.skillDuration = skillData.skill_duration; // 스킬 지속 시간
    this.skillValue = skillData.skill_value; // 스킬로 인해 감소되는 이동 속도 비율 (0.5는 50% 감소 의미)
    this.antiAir = skillData.anti_air; // 공중 유닛 공격 가능 여부
  }

  attack(monster) {
    if (monster.type === 'flying' && this.antiAir === false) {
      console.log(`Tower 대공 공격 실패 ${this.id}`);
      return;
    }
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower;
      this.cooldown = this.initialCooldown; // 3초 쿨타임 (초당 60프레임)
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

/**
 * 일반 공격 타워
 * towerId 1001 / skillId 2001
 * @class
 */
export class NormalTower extends Tower {
  /**
   * 노말 타워의 생성자
   *
   * @constructor
   * @param {number} x 타워의 x 좌표
   * @param {number} y 타워의 y 좌표
   */
  constructor(x, y) {
    super(TOWER_TYPE.NORMAL, x, y);
  }
}

/**
 * 슬로우 타워
 * towerId 1002 / skillId 2002
 * @class
 */
export class SlowTower extends Tower {
  /**
   * 슬로우 타워의 생성자
   *
   * @constructor
   * @param {number} x 타워의 x 좌표
   * @param {number} y 타워의 y 좌표
   */
  constructor(x, y) {
    super(TOWER_TYPE.SLOW, x, y);
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      this.target = monster;
      this.beamDuration = 30;

      // 몬스터 이동 속도 감소 적용
      if (!monster.isSlowed) {
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

      this.cooldown = this.initialCooldown; // 공격 후 쿨타임 초기화
    }
  }
}

/**
 * 멀티공격 타워
 * towerId 1003 / skillId 2003
 * @class
 */
export class MultiTower extends Tower {
  /**
   * 멀티공격 타워의 생성자
   *
   * @constructor
   * @param {number} x 타워의 x 좌표
   * @param {number} y 타워의 y 좌표
   */
  constructor(x, y) {
    super(TOWER_TYPE.MULTI, x, y);
  }

  attack(monster) {
    if (this.cooldown <= 0) {
      this.target = monster;
      this.beamDuration = 30;

      this.cooldown = this.initialCooldown; // 공격 후 쿨타임 초기화
    }
  }
}
