import { Tower } from './tower.model';

/**
 * 일반 타워 클래스
 */
export class NormalTower extends Tower {
  constructor(assetId, spawnLocation) {
    super(assetId, spawnLocation);
  }
}
