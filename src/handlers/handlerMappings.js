import { gameStart, gameEnd } from './game.handler.js';
import { buyTower, sellTower, upgradeTower, attackMonster } from './tower.handler.js';
import { checkBalanceAccount, hasSufficientBalance } from './account.handler.js';
import { getCurrentStage, stageEnd, stageStart } from './stage.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  21: buyTower,
  22: sellTower,
  23: upgradeTower,
  100: checkBalanceAccount,
  101: hasSufficientBalance,
  200: getCurrentStage,
  201: stageStart,
  202: stageEnd,
  301: attackMonster,
};

export default handlerMappings;
