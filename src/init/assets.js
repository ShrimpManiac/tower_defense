import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ASSET_TYPE } from '../constants.js';

/**
 * 로드한 게임에셋
 */
let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 최상위 경로 + assets 폴더
const __basePath = path.join(__dirname, '../../client/assets');

/**
 * 파일을 비동기 병렬로 읽는 함수
 *
 * loadGameAssets()에서 게임에셋을 불러올 때 쓰기 위한 헬퍼 함수로 쓰임
 * @param {string} filename 파일이름
 * @returns
 */
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

/**
 * 게임에셋을 불러오는 함수
 *
 * 게임 시작시 실행
 * @returns
 */
export const loadGameAssets = async () => {
  try {
    const [stages, monsters, towers, towerSkills, paths] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('monster.json'),
      readFileAsync('tower.json'),
      readFileAsync('tower_skill.json'),
      readFileAsync('path.json'),
    ]);

    stages.data.sort((a, b) => a.id - b.id);
    monsters.data.sort((a, b) => a.id - b.id);
    towers.data.sort((a, b) => a.id - b.id);
    towerSkills.data.sort((a, b) => a.id - b.id);
    paths.data.sort((a, b) => a.id - b.id);

    gameAssets = { stages, monsters, towers, towerSkills, paths };
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

/**
 * 로드한 게임에셋을 조회하는 함수
 *
 * 호출 예시: const towers = getGameAsset(ASSET_TYPE.TOWER);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @returns {JSON} JSON화된 게임에셋
 */
export const getGameAsset = (assetType) => {
  switch (assetType) {
    case ASSET_TYPE.MONSTER:
      return gameAssets.monsters;
    case ASSET_TYPE.STAGE:
      return gameAssets.stages;
    case ASSET_TYPE.TOWER:
      return gameAssets.towers;
    case ASSET_TYPE.TOWER_SKILL:
      return gameAssets.towerSkills;
    case ASSET_TYPE.PATH:
      return gameAssets.path;
    default:
      throw new Error('Invalid asset type: ' + assetType);
  }
};

/**
 * 게임에셋의 특정 항목을 id로 조회하는 함수
 *
 * 호출 예시: const monsterData = findAssetDataById(ASSET_TYPE.MONSTER, monsterId);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {number} id 조회할 항목의 id
 * @returns {JSON} 해당 id의 항목 ( 예시: { "id: 3004, maxHp: 50, ..."} )
 */
export const findAssetDataById = (assetType, id) => {
  const { stages, monsters, towers, towerSkills } = gameAssets;

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stages.data.find((stage) => stage.id === id);
    case ASSET_TYPE.MONSTER:
      return monsters.data.find((monster) => monster.id === id);
    case ASSET_TYPE.TOWER:
      return towers.data.find((tower) => tower.id === id);
    case ASSET_TYPE.TOWER_SKILL:
      return towerSkills.data.find((towerSkill) => towerSkill.id === id);
    case ASSET_TYPE.PATH:
      return pathData.data.find((path) => path.id === id);
    default:
      throw new Error('Invalid asset type: ' + assetType);
  }
};

/**
 * 특정 게임에셋의 다음 항목을 조회하는 함수
 *
 * 호출 예시: const nextStage = getNextAsset(ASSET_TYPE.STAGE, stageId);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {number} id 현재 항목의 id ( 예시: 4002 )
 * @returns {JSON} 다음 id의 항목 ( 예시: { "id: 4003, monsterIds: [...], ..."} )
 */
export const getNextAsset = (assetType, id) => {
  return findAssetDataById(assetType, id + 1);
};

/**
 * 특정 게임에셋의 첫 항목을 조회하는 함수
 *
 * 호출 예시: const firstStage = getFirstAsset(ASSET_TYPE.STAGE);
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @returns {JSON} 지정한 게임애셋의 첫 항목 ( 예시: { "id: 4001, monsterIds: [...], ..."} )
 */
export const getFirstAsset = (assetType) => {
  const { stages, monsters, towers, towerSkills } = gameAssets;

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stages.data[0].id;
    case ASSET_TYPE.MONSTER:
      return monsters.data[0].id;
    case ASSET_TYPE.TOWER:
      return towers.data[0].id;
    case ASSET_TYPE.TOWER_SKILL:
      return towerSkills.data[0].id;
    case ASSET_TYPE.PATH:
      return pathData.data[0].id;
    default:
      throw new Error('Invalid asset type: ' + assetType);
  }
};
