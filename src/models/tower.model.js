let towers = {}; // 타워 목록을 관리

// 타워 초기화
export const clearTowers = (uuid) => {
  towers[uuid] = [];
};

// 전체 타워 Getter
export const getTowers = (uuid) => {
  if (!towers[uuid] || towers[uuid].length === 0) throw new Error(`User ${uuid} has no tower`);
  return towers[uuid];
};

// 타워 Setter
export const setTower = (uuid, tower) => {
  return towers[uuid].push(tower);
};

// 타워 삭제
export const deleteTower = (uuid, towerId) => {
  // 삭제할 타워의 인덱스 검색
  const towerIndex = towers[uuid].findIndex((tower) => tower.id === towerId);
  // 예외처리: 타워를 찾지 못함
  if (towerIndex === -1) throw new Error(`Tower not found`);
  // 삭제할 타워 저장
  const deletedTower = towers[uuid][towerIndex];
  // 타워 삭제
  towers[uuid].splice(towerIndex, 1);
  // 삭제한 타워 반환
  return deletedTower;
};

// Id로 타워 찾기
export function getTowerById(uuid, towerId) {
  if (!towers[uuid] || towers[uuid].length === 0) throw new Error(`User ${uuid} has no tower`);
  let tower = towers[uuid].find((tower) => tower.id === towerId);
  if (!tower) throw new Error(`Tower not found`);
  return tower;
}
