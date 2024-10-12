import { gameStart, gameEnd } from './game.handler.js';
import { buyTower, sellTower, upgradeTower } from './tower.handler.js';
import { checkBalanceAccount, hasSufficientBalance } from './account.handler.js';
import { getCurrentStage } from './stage.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  21: buyTower,
  22: sellTower,
  23: upgradeTower,
  100: checkBalanceAccount,
  101: hasSufficientBalance,
  200: getCurrentStage,
};

export default handlerMappings;
