import { ASSET_TYPE } from '../constants.js';
import { getGameAssets, getNextAsset } from '../init/assets.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';

/**
 * 스테이지 최초 초기화
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Object} 성공 여부를 알리는 상태와 메세지
 */
export const initializeStage = (uuid) => {
  try {
    const stages = getGameAssets(ASSET_TYPE.STAGE);
    // stage asset에서 첫번째 스테이지 id 가져옴

    const createResult = createStage(uuid).status;
    if (createResult !== 'success') throw new Error('Failed to create stage');

    const initialStageId = stages.data.sort((a, b) => a.id - b.id)[0].id;

    // 최초 스테이지 설정
    const setResult = setStage(uuid, initialStageId, Date.now());
    if (setResult.status !== 'success') throw new Error(setResult.message);

    console.log(`[Stage] ${uuid} : Successfully initialized ${initialStageId} stage`);
    return { status: 'success', message: 'Successfully initialized stage' };
  } catch (err) {
    console.error(err.message);
    return { status: 'fail', message: err.message };
  }
};
/**
 * 현재 스테이지 정보 불러오기 (클라이언트용)
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Object} 상태, 메세지, 스테이지Id(데이터 테이블 Id) - stageId, 몇번째 스테이지 인지 - stageNumber
 */
export const getCurrentStage = (uuid) => {
  try {
    const stages = getGameAssets(ASSET_TYPE.STAGE);

    // 저장된 스테이지 로드
    const currentStage = getStage(uuid);
    if (currentStage === undefined) throw new Error('Failed to get stage');
    // 최근 스테이지 ID 획득
    const currentStageId = currentStage.id;
    // 스테이지 넘버 획득
    const stageData = stages.data.sort((a, b) => a.id - b.id);
    const stageDataIndex = stageData.findIndex((stage) => stage.id === currentStageId);
    if (stageDataIndex === -1) throw new Error('Not found stage');
    const stageNumber = stageDataIndex + 1;

    return {
      status: 'success',
      message: 'Successfully retrieved stage',
      stageId: currentStageId,
      stageNumber,
    };
  } catch (err) {
    console.error(err.message);
    return { status: 'fail', message: err.message };
  }
};

/**
 * 다음 스테이지로 이동
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Object} 성공 여부를 알리는 상태와 메세지
 * 다음 스테이지가 없을 경우 변동 없이 fail 상태와 Last Stage 메세지 반환
 */
export const moveToNextStage = (uuid) => {
  try {
    // 최근 스테이지 아이디 획득
    const { stageId } = getCurrentStage(uuid);
    if (stageId === undefined) throw new Error('Failed to retrieve the current stage.');
    // 다음 스테이지 아이디 획득
    const { id: nextStageId } = getNextAsset(ASSET_TYPE.STAGE, stageId);
    if (nextStageId === undefined) {
      return { status: 'fail', message: 'Last Stage' };
    }
    // 다음 스테이지 설정
    const nextStageResult = setStage(uuid, nextStageId, Date.now());

    if (nextStageResult.status === 'fail') throw new Error(nextStageResult.message);
    return { status: 'success', message: nextStageResult.message };
  } catch (err) {
    console.error(err.message);
    return { status: 'fail', message: err.message };
  }
};
/**
 * 현 스테이지에서 나오는 몬스터 종류 가져오기
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Array} monsterIds - 몬스터 아이디가 담긴 배열
 */
export const getMonstersByStage = (uuid) => {
  try {
    // 저장된 스테이지 로드
    const currentStage = getStage(uuid);
    if (currentStage === undefined) throw new Error('Failed to get stage');
    const { monsterIds } = currentStage;
    if (monsterIds === undefined) throw new Error('Failed to load monstersId');
    return monsterIds;
  } catch (err) {
    console.error(err.message);
    return { status: 'fail', message: err.message };
  }
};

/**
 * 현 스테이지에서 나오는 몬스터 출현 수 가져오기
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Array} monsterIds - 몬스터 출현 수가 담긴 배열
 */
export const getMonsterCountByStage = (uuid) => {
  try {
    // 저장된 스테이지 로드
    const currentStage = getStage(uuid);
    if (currentStage === undefined) throw new Error('Failed to get stage');
    const { numMonsters } = currentStage;
    if (numMonsters === undefined) throw new Error('Failed to load numMonsters');
    return numMonsters;
  } catch (err) {
    console.error(err.message);
    return { status: 'fail', message: err.message };
  }
};

/**
 * 현 스테이지 시작 시간 반환
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Date} timestamp
 */
export const getStartTimeByStage = (uuid) => {
  try {
    // 저장된 스테이지 로드
    const currentStage = getStage(uuid);
    if (currentStage === undefined) throw new Error('Failed to get stage');

    const { timestamp } = currentStage;
    if (timestamp === undefined) throw new Error('Failed to load timestamp');
    return timestamp;
  } catch (err) {
    console.error(err.message);
    return { status: 'fail', message: err.message };
  }
};

export const stageStart = (uuid) => {
  // 기본 틀만 구성, 아직 미완성

  const currentStage = getStage(uuid);
  // 현재 스테이지에서 생성할 몬스터 함수
  // 준비가 완료되면 success 신호를 날림
  return { status: 'success', message: 'success init' };
};

export const stageEnd = (uuid) => {
  // 기본 틀만 구성, 아직 미완성

  // 현재 스테이지 몬스터 정보 날림

  const result = moveToNextStage(uuid);
  console.log(result);
  if (result.status === 'fail') return { status: 'fail', message: 'Last_Stage' };

  return { status: 'success', message: 'success init' };
  // 완료되면 success 신호를 날림
};
