export class MonsterModel {
  constructor(path, monsterData) {
    if (!path || path.length <= 0) {
      throw new Error('몬스터가 이동할 경로가 필요합니다.');
    }

    this.id = monsterData.id;
    this.hp = monsterData.hp;
    this.attackPower = monsterData.attackPower;
    this.defense = monsterData.defense;
    this.speed = monsterData.speed;
    this.goldDrop = monsterData.goldDrop;
    this.score = monsterData.score;
    this.type = monsterData.type;

    this.path = path;
    this.currentIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;
  }

  move(base) {
    if (this.currentIndex < this.path.length - 1) {
      const nextPoint = this.path[this.currentIndex + 1];
      const deltaX = nextPoint.x - this.x;
      const deltaY = nextPoint.y - this.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < this.speed) {
        this.currentIndex++;
      } else {
        this.x += (deltaX / distance) * this.speed;
        this.y += (deltaY / distance) * this.speed;
      }
      return false; // 기지에 도달하지 않음
    } else {
      const isDestroyed = base.takeDamage(this.attackPower); // 기지를 공격
      this.hp = 0; // 몬스터 소멸
      return isDestroyed;
    }
  }

  getMonsterData() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      hp: this.hp,
      attackPower: this.attackPower,
      defense: this.defense,
      speed: this.speed,
      goldDrop: this.goldDrop,
      score: this.score,
      type: this.type,
    };
  }
}
