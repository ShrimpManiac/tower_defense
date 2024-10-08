// 지원하는 클라이언트 버전
export const CLIENT_VERSION = ['1.0.0', '1.0.1', '1.1.0'];

// 클라이언트 vs 서버간 시간차 오차범위
export const DELAY_TOLERANCE = 5; // seconds

// Asset ENUM
export const ASSET_TYPE = Object.freeze({
  STAGE: 'stages',
  ITEM: 'items',
  ITEM_UNLOCK: 'item_unlocks',
});
