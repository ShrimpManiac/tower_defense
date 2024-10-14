/**
 * 지원하는 클라이언트 버전
 */
export const CLIENT_VERSION = '1.0.0';

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

/**
 * 타워 광선 애니메이션 지속시간
 *
 * 30프레임 = 0.5초 (1초당 60프레임)
 */
export const BEAM_DURATION = 30;
