export class Monster {
  constructor(monsterData, monsterImages) {
    this.id = monsterData.id;
    this.hp = monsterData.hp;
    this.maxHp = monsterData.maxHp;
    this.attackPower = monsterData.attackPower;
    this.defense = monsterData.defense;
    this.speed = monsterData.speed;
    this.goldDrop = monsterData.goldDrop;
    this.score = monsterData.score;
    this.type = monsterData.type;

    this.x = monsterData.x;
    this.y = monsterData.y;
    this.width = 80;
    this.height = 80;

    // 클라이언트에서는 이미지를 처리
    this.image = monsterImages[monsterData.monsterNumber];
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`(HP: ${this.hp}/${this.maxHp})`, this.x, this.y - 5);
  }
}
