import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ASSET_TYPE } from '../constants.js';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 최상위 경로 + assets 폴더
const __basePath = path.join(__dirname, '../../assets');

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다.
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

// Asset을 로드하는 함수
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

// 로드한 Asset을 조회하는 함수
export const getGameAssets = () => {
  return gameAssets;
};

// Asset의 특정 데이터를 id로 조회하는 함수
export const findAssetDataById = (assetType, id) => {
  const { stages, items, itemUnlocks } = gameAssets;

  switch (assetType) {
    case ASSET_TYPE.STAGE:
      return stages.data.find((stage) => stage.id === id);
    case ASSET_TYPE.ITEM:
      return items.data.find((item) => item.id === id);
    case ASSET_TYPE.ITEM_UNLOCK:
      return itemUnlocks.data.find((itemUnlock) => itemUnlock.id === id);
    default:
      throw new Error('Invalid asset type: ' + assetType);
  }
};

export const getNextAsset = (assetType, id) => {
  return findAssetDataById(assetType, id + 1);
};
