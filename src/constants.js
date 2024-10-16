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
  PATH: 'path',
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
 * 업그레이드 비용 증가율
 */
export const UPGRADE_COST_SCALER = 1.5;

/**
 * 업그레이드 스탯 보너스
 *
 * @key 타워 레벨
 * @value [공격력 보너스, 사거리 보너스]
 */
export const UPGRADE_BONUS = Object.freeze({
  1: { attack_bonus: 1.5, range_bonus: 1.2 },
  2: { attack_bonus: 1.35, range_bonus: 1.15 },
  3: { attack_bonus: 1.2, range_bonus: 1.1 },
});

export const START_GOLD = 300;
export const MAX_TOWER_LEVEL = 3;
