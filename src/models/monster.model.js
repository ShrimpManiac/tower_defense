export class MonsterModel {
  constructor(path, level) {
    if (!path || path.length <= 0) {
      throw new Error('몬스터가 이동할 경로가 필요합니다.');
    }
    this.monsterNumber = Math.floor(Math.random() * 5); // 서버에서는 이미지 대신 번호만 유지
    this.path = path;
    this.currentIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.speed = 2;
    this.level = level;
    this.init(level);
  }

  init(level) {
    this.maxHp = 100 + 10 * level;
    this.hp = this.maxHp;
    this.attackPower = 10 + 1 * level;
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
      return false; // 기지에 도달하지 않았음
    } else {
      const isDestroyed = base.takeDamage(this.attackPower);
      this.hp = 0; // 몬스터가 소멸됨
      return isDestroyed;
    }
  }

  getMonsterData() {
    return {
      x: this.x,
      y: this.y,
      hp: this.hp,
      maxHp: this.maxHp,
      level: this.level,
      monsterNumber: this.monsterNumber,
    };
  }
}
