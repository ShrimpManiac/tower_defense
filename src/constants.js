/**
 * 지원하는 클라이언트 버전
 */
export const CLIENT_VERSION = ['1.0.0'];

/**
 * 클라이언트 - 서버간 허용되는 시간 오차
 */
export const DELAY_TOLERANCE = 5; // seconds

/**
 * enum화 된 게임에셋 타입
 */
export const ASSET_TYPE = Object.freeze({
  STAGE: 'stage',
  MONSTER: 'monster',
  TOWER: 'tower',
  TOWER_SKILL: 'tower_skill',
});

export const TOWER_TYPE = Object.freeze({
  NORMAL: 1001,
  SLOW: 1002,
  MULTI: 1003,
});

/**
 * 업그레이드 비용
 */
export const UPGRADE_COST = 0;

/**
 * 타워 환불
 */
export const SELL_PENALTY = 0.5;

/**
 * 타워 환불
 */
export const UPGRADE_BONUS = [
  { level: 1, rate: 0.3 },
  { level: 2, rate: 0.2 },
  { level: 3, rate: 0.1 },
];
