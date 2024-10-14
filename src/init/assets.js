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
 * @returns
 */
export const loadGameAssets = async () => {
  try {
    const [stage, monster, tower, tower_skill] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('monster.json'),
      readFileAsync('tower.json'),
      readFileAsync('tower_skill.json'),
    ]);

    gameAssets = { stage, monster, tower, tower_skill };
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

/**
 * 로드한 게임에셋을 조회하는 함수
 * @returns {JSON} JSON화된 전체 게임에셋
 */
export const getGameAssets = () => {
  return gameAssets;
};

/**
 * 게임에셋의 특정 항목을 id로 조회하는 함수
 * @param {ASSET_TYPE} assetType 조회할 게임에셋 타입
 * @param {number} id 조회할 항목의 id
 * @returns {JSON} 해당 id의 항목 ( 예시: { "id: 1001, hp: 50 "} )
 */
export const findAssetDataById = (assetType, id) => {
  const { stage, monster, tower, tower_Skill } = gameAssets;

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stage.data.find((stage) => stage.id === id);
    case ASSET_TYPE.MONSTER:
      return monster.data.find((monster) => monster.id === id);
    case ASSET_TYPE.TOWER:
      return tower.data.find((tower) => tower.id === id);
    case ASSET_TYPE.TOWER_SKILL:
      return tower_Skill.data.find((towerSkill) => towerSkill.id === id);
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
  const result = findAssetDataById(assetType, id + 1);
  if (result === undefined) throw new Error('Not Found Asset');
  return result;
};
