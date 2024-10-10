export class Monster {
  constructor(monsterData, monsterImages) {
    this.monsterNumber = monsterData.monsterNumber;
    this.x = monsterData.x;
    this.y = monsterData.y;
    this.hp = monsterData.hp;
    this.maxHp = monsterData.maxHp;
    this.level = monsterData.level;
    this.image = monsterImages[this.monsterNumber]; // 이미지는 클라이언트에서 로드
    this.width = 80;
    this.height = 80;
  }

  update(monsterData) {
    // 서버로부터 받은 새로운 데이터를 업데이트
    this.x = monsterData.x;
    this.y = monsterData.y;
    this.hp = monsterData.hp;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`(레벨 ${this.level}) ${this.hp}/${this.maxHp}`, this.x, this.y - 5);
  }
}
