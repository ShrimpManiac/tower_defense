import { moveStageHandler } from './stage.handler.js';
import { gameStart, gameEnd } from './game.handler.js';
import { obtainItem } from './item.handler.js';
import { checkBalanceAccount, hasSufficientBalance } from './account.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  20: obtainItem,
  100: checkBalanceAccount,
  101: hasSufficientBalance,
};

export default handlerMappings;
