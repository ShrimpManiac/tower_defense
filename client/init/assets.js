import { ASSET_TYPE } from './Constants.js';

let gameAssets = null;

export const loadGameAssets = async (assets) => {
  gameAssets = assets;
};

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
