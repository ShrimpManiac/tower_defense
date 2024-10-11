import { ASSET_TYPE } from '../constants.js';
import monsterData from '../assets/monster.json' with { type: 'json' };
import stageData from '../assets/stage.json' with { type: 'json' };
import towerData from '../assets/tower.json' with { type: 'json' };
import towerSkillData from '../assets/tower_skill.json' with { type: 'json' };

/**
 * 로드한 게임에셋을 조회하는 함수
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @returns {JSON} JSON화된 게임에셋
 */
export const getGameAssets = (assetType) => {
  switch (assetType) {
    case ASSET_TYPE.MONSTER:
      return monsterData;
    case ASSET_TYPE.STAGE:
      return stageData;
    case ASSET_TYPE.TOWER:
      return towerData;
    case ASSET_TYPE.TOWER_SKILL:
      return towerSkillData;
    default:
      throw new Error('Invalid asset type: ' + assetType);
  }
};

/**
 * 게임에셋의 특정 항목을 id로 조회하는 함수
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {number} id 조회할 항목의 id
 * @returns {JSON} 해당 id의 항목 ( 예시: { "id: 1001, hp: 50 "} )
 */
export const findAssetDataById = (assetType, id) => {
  switch (assetType) {
    case ASSET_TYPE.MONSTER:
      return monsterData.data.find((monster) => monster.id === id);
    case ASSET_TYPE.STAGE:
      return stageData.data.find((stage) => stage.id === id);
    case ASSET_TYPE.TOWER:
      return towerData.data.find((tower) => tower.id === id);
    case ASSET_TYPE.TOWER_SKILL:
      return towerSkillData.data.find((towerSkill) => towerSkill.id === id);
    default:
      throw new Error('Invalid asset type: ' + assetType);
  }
};

/**
 * 특정 게임에셋의 다음 항목을 조회하는 함수
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {number} id 현재 항목의 id
 * @returns {JSON} 다음 id의 항목 ( 예시: { "id: 1002, hp: 60 "} )
 */
export const getNextAsset = (assetType, id) => {
  return findAssetDataById(assetType, id + 1);
};
