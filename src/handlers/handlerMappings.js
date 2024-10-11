import { moveStageHandler } from './stage.handler.js';
import { gameStart, gameEnd } from './game.handler.js';
import { obtainItem } from './item.handler.js';
import { checkBalanceAccount } from './account.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  20: obtainItem,
  100: checkBalanceAccount,
};

export default handlerMappings;
