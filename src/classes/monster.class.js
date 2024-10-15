import { findAssetDataById } from '../init/assets.js';
import { ASSET_TYPE } from '../constants.js';

export class Monster {
  static instanceId = 0;

  /**
   * @param {Number} assetId 몬스터 애셋 ID (데이터테이블 조회용)
   * @param {{x: Number, y: Number}[]} path 몬스터 경로
   */
  constructor(assetId, path) {
    if (!path || path.length <= 0) {
      throw new Error('몬스터가 이동할 경로가 필요합니다.');
    }

    let monsterData = findAssetDataById(ASSET_TYPE.MONSTER, assetId);
    /**
     * 몬스터 인스턴스 ID
     */
    this.id = Monster.instanceId++;

    // 경로 & 현재위치
    this.path = path; // 몬스터가 이동할 경로
    this.currentPathIndex = 0; // 몬스터가 이동 중인 경로의 인덱스
    this.x = path[0].x; // 몬스터의 x 좌표 (최초 위치는 경로의 첫 번째 지점)
    this.y = path[0].y; // 몬스터의 y 좌표 (최초 위치는 경로의 첫 번째 지점)

    // 체력
    this.maxHp = monsterData.maxHp; // 최대 체력
    this.hp = this.maxHp; // 현재 체력

    // 기본스탯
    this.attackPower = monsterData.attackPower; // 공격력
    this.defense = monsterData.defense; // 방어력
    this.speed = monsterData.speed; // 이동속도
    this.goldDrop = monsterData.goldDrop; // 처치시 골드드랍
    this.score = monsterData.score; // 처치시 점수

    // 몬스터 타입
    this.type = monsterData.type;
    this.isSlowed = false;

    // 이미지 크기
    this.width = monsterData.width; // 이미지 가로 크기
    this.height = monsterData.height; // 이미지 세로 크기
  }
}
