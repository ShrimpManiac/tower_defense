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
 * 업그레이드 비용 증가율
 */
export const UPGRADE_COST_SCALER = 1.5;

/**
 * 타워 환불 가격비율
 */
export const SELL_PENALTY = 0.5;

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

/**
 * 타워 광선 애니메이션 지속시간
 *
 * 30프레임 = 0.5초 (1초당 60프레임)
 */
export const BEAM_DURATION = 30;
