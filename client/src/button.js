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

// 버튼 등록함수
export function initButton(normal, slow, multi, upgrade, sell) {
  normal.textContent = '일반타워 구입';
  normal.style.position = 'absolute';
  normal.style.top = '60px';
  normal.style.right = '10px';
  normal.style.padding = '10px 20px';
  normal.style.fontSize = '16px';
  normal.style.cursor = 'pointer';

  document.body.appendChild(normal);

  slow.textContent = '슬로우타워 구입';
  slow.style.position = 'absolute';
  slow.style.top = '110px';
  slow.style.right = '10px';
  slow.style.padding = '10px 20px';
  slow.style.fontSize = '16px';
  slow.style.cursor = 'pointer';

  document.body.appendChild(slow);

  multi.textContent = '멀티타워 구입';
  multi.style.position = 'absolute';
  multi.style.top = '160px';
  multi.style.right = '10px';
  multi.style.padding = '10px 20px';
  multi.style.fontSize = '16px';
  multi.style.cursor = 'pointer';

  document.body.appendChild(multi);

  // 타워 업그레이드 버튼 처리
  upgrade.textContent = '업그레이드';
  upgrade.style.position = 'absolute';
  upgrade.style.top = '210px';
  upgrade.style.right = '10px';
  upgrade.style.padding = '10px 20px';
  upgrade.style.fontSize = '16px';
  upgrade.style.cursor = 'pointer';
  upgrade.style.display = 'none'; // 처음엔 버튼을 숨깁니다.

  document.body.appendChild(upgrade);

  // 타워 판매 버튼 처리
  sell.textContent = '판매';
  sell.style.position = 'absolute';
  sell.style.top = '260px';
  sell.style.right = '10px';
  sell.style.padding = '10px 20px';
  sell.style.fontSize = '16px';
  sell.style.cursor = 'pointer';
  sell.style.display = 'none'; // 처음엔 버튼을 숨깁니다.
  document.body.appendChild(sell);
}
