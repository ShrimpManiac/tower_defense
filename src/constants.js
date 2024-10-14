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

/**
 * 게임 시작 시 지급할 골드
 */
export const START_GOLD = 300;
