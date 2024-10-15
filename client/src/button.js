export const clearTowers = () => {
  towers = [];
};

export function createTower(assetId, instanceId, spawnLocation) {
  switch (assetId) {
    case TOWER_TYPE.NORMAL:
      return new NormalTower(assetId, instanceId, spawnLocation);
    case TOWER_TYPE.SLOW:
      return new SlowTower(assetId, instanceId, spawnLocation);
    case TOWER_TYPE.MULTI:
      return new MultiTower(assetId, instanceId, spawnLocation);
    default:
      console.error(`알 수 없는 타워 타입: ${assetId}`);
      return null;
  }
}

export function showButton(button) {
  button.style.display = 'block';
}

export function hideButton(button) {
  button.style.display = 'none';
}
