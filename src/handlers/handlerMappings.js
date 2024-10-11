import { gameStart, gameEnd } from './game.handler.js';
import { buyTower, sellTower, upgradeTower } from './tower.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  21: buyTower,
  22: sellTower,
  23: upgradeTower,
};

export default handlerMappings;
