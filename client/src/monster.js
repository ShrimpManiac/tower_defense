import { ASSET_TYPE } from '../constants.js';
import { findAssetDataById } from '../utils/assets.js';

export class Monster {
  /**
   *
   * @param {Number} assetId 몬스터 애셋 ID (데이터테이블 조회용)
   * @param {Number} instanceId 몬스터 인스턴스 ID (서버에서 수신)
   * @param {{x: Number, y: Number}} spawnLocation 소환 위치 좌표
   */
  constructor(assetId, instanceId, spawnLocation) {
    let monsterData = findAssetDataById(ASSET_TYPE.MONSTER, assetId);
    /**
     * 몬스터 인스턴스 ID
     */
    this.id = instanceId;

    this.maxHp = monsterData.maxHp;
    this.hp = this.maxHp;
    this.attackPower = monsterData.attackPower;
    this.defense = monsterData.defense;
    this.speed = monsterData.speed;
    this.goldDrop = monsterData.goldDrop;
    this.score = monsterData.score;
    this.type = monsterData.type;

    this.x = spawnLocation.x;
    this.y = spawnLocation.y;

    this.image = monsterData.image;
    this.width = monsterData.width;
    this.height = monsterData.height;
  }

  draw(ctx) {
    const img = new Image();
    img.src = this.image;
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`(HP: ${this.hp}/${this.maxHp})`, this.x, this.y - 5);
  }
}
