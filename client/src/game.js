import { Base } from './base.js';
import { Monster } from '../classes/monster.class.js';
import { clearMonsters, spawnedMonsters, monstersToSpawn } from '../models/monster.model.js';
import {
  spawnMonster,
  startSpawningMonsters,
  initSpawnQueue,
} from '../handlers/monster.handler.js';
// import { NormalTower } from '../../src/classes/towers/normal_tower.class.js';
// import { SlowTower } from '../../src/classes/towers/slow_tower.class.js';
// import { MultiTower } from '../../src/classes/towers/multi_tower.class.js';
import '../init/socket.js';
import { disconnectSocket, sendEvent } from '../init/socket.js';
import { findAssetDataById, getGameAsset } from '../utils/assets.js';
import { ASSET_TYPE, TOWER_TYPE, MAX_TOWER_LEVEL } from '../constants.js';
import {
  createTower,
  deleteTower,
  setTower,
  clearTowers,
  getTowers,
  getTowerAtLocation,
} from './tower.js';
import { showButton, hideButton, initButton } from './button.js';
const res = await fetch('http://localhost:3000/api/auth', {
  method: 'get',
  credentials: 'include',
});

if (!res.ok) {
  disconnectSocket();
  location.reload();
}
/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const NUM_OF_MONSTERS = 5; // 몬스터 개수

let currentStageId = 0;
let currentStageNumber = 0;
let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 0; // 기지 체력
let numOfInitialTowers = 0; // 초기 타워 개수
clearTowers();
const towers = getTowers();

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;

// 몬스터 경로
let monsterPath1 = findAssetDataById(ASSET_TYPE.PATH, 5001).path;
let monsterPath2 = findAssetDataById(ASSET_TYPE.PATH, 5002).path;
let monsterPath3 = findAssetDataById(ASSET_TYPE.PATH, 5003).path;
export let monsterPaths = [monsterPath1, monsterPath2, monsterPath3];

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const baseImage = new Image();
baseImage.src = 'images/base.png';

const pathImage = new Image();
pathImage.src = 'images/path.png';

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}

// 서버와 클라이언트 골드 잔액 동기화
async function loadGoldBalance() {
  try {
    const response = await sendEvent(100, {});

    const balance = response.balance;

    if (balance === undefined || response.status === 'failure') {
      alert('Fail to load Gold Balance');

      location.reload();
    }

    userGold = balance;
  } catch (err) {
    console.error('Error loading gold balance:', err.message);
    alert('Error loading gold balance', err.message);

    location.reload();
  }
}

// 서버와 클라이언트 스테이지 동기화
async function loadCurrentStage() {
  try {
    const response = await sendEvent(200);

    const stageId = response.stageId;
    const stageNumber = response.stageNumber;

    if (stageId === undefined || stageNumber === undefined || response.status === 'failure') {
      alert('Fail to load current stage');

      location.reload();
    }

    currentStageId = stageId;
    currentStageNumber = stageNumber;
  } catch (err) {
    console.error('Error loading gold balance:', err.message);
    alert('Error loading gold balance', err.message);

    location.reload();
  }
}
// INCOMPLETE : 사용 안하는 함수. 확인 후 삭제 필요.
// function generateRandomMonsterPath() {
//   const path = [];
//   let currentX = 0;
//   let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

//   path.push({ x: currentX, y: currentY });

//   while (currentX < canvas.width) {
//     currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
//     // x 좌표에 대한 clamp 처리
//     if (currentX > canvas.width) {
//       currentX = canvas.width;
//     }

//     currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
//     // y 좌표에 대한 clamp 처리
//     if (currentY < 0) {
//       currentY = 0;
//     }
//     if (currentY > canvas.height) {
//       currentY = canvas.height;
//     }

//     path.push({ x: currentX, y: currentY });
//   }

//   return path;
// }

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath(monsterPath1);
  drawPath(monsterPath2);
  drawPath(monsterPath3);
}

function drawPath(monsterPath) {
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 80; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
      // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

// INCOMPLETE : monsterPath 지정 필요.

function getRandomPositionNearPath(maxDistance) {
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}

// INCOMPLETE : Tower 찾을 수 없음
function placeInitialTowers() {
  /* 
    타워를 초기에 배치하는 함수입니다.
    무언가 빠진 코드가 있는 것 같지 않나요? 
  */
  for (let i = 0; i < numOfInitialTowers; i++) {
    const { x, y } = getRandomPositionNearPath(200);
    const tower = new Tower(assetId, instanceId, { x, y }); // INCOMPLETE: 파라미터를 통해 타워 종류와 인스턴스ID 지정 필요
    tower.draw(ctx);
  }
}

function placeBase() {
  const lastPoint = monsterPath1[monsterPath1.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function displayInfo() {
  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`현재 스테이지: ${currentStageNumber}`, 100, 100); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 150); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 200); // 골드 표시
}
let isStageActive = false; // 스테이지 진행 중 여부
let animationFrameId;

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  drawPath(monsterPath1); // 경로 다시 그리기
  drawPath(monsterPath2);
  drawPath(monsterPath3);
  displayInfo(); // 게임 정보 표시

  // 타워 그리기 및 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx);
    tower.updateCooldown();
    if (isStageActive) {
      if (tower.assetId === TOWER_TYPE.MULTI) {
        // MultiTower의 경우 사거리 내에서 최대 3개의 몬스터를 공격
        // IMCOMPLETE 사거리 계산 attack 함수 안으로 넣는 방법 고민
        const targets = [];
        for (let i = 0; i < spawnedMonsters.length; i++) {
          const monster = spawnedMonsters[i];
          const distance = Math.hypot(tower.x - monster.x, tower.y - monster.y);
          if (distance < tower.range) {
            targets.push(monster);
          }
          if (targets.length >= tower.skillValue) {
            break; // 타겟이 3개 채워지면 그만 찾음
          }
        }
        // 각 몬스터 한번에 공격
        console.log(targets);
        targets.forEach((target) => {
          tower.attack(target);
          tower.drawBeam(ctx, target);
          // INCOMPLETE sendEvent 공격 패킷 요청 필요
        });
      } else {
        spawnedMonsters.forEach((monster) => {
          const distance = Math.hypot(tower.x - monster.x, tower.y - monster.y);
          if (distance < tower.range) {
            tower.attack(monster);
            tower.drawBeam(ctx);
            console.log(monster.hp);
            // INCOMPLETE sendEvent 공격 패킷 요청 필요
          }
        });
      }
    }
  });

  // 기지 상태 갱신 및 그리기
  base.draw(ctx, baseImage);

  if (isStageActive) {
    // 활성 스테이지에만 몬스터 이동 및 게임 오버 체크
    for (let i = spawnedMonsters.length - 1; i >= 0; i--) {
      const monster = spawnedMonsters[i];
      if (monster.hp > 0) {
        const isDestroyed = monster.move(base);
        if (isDestroyed) {
          endGame();
        }
        monster.draw(ctx);
      } else {
        spawnedMonsters.splice(i, 1); // 몬스터 제거
      }
    }

    if (spawnedMonsters.length === 0 && monstersToSpawn.length == 0) {
      endStage(); // 모든 몬스터 제거 시 스테이지 종료
    }
  }

  // 루프를 유지하기 위해 다음 프레임 요청
  animationFrameId = requestAnimationFrame(gameLoop);
}

// new Promise((resolve) => (towerImage.onload = resolve)),
// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  if (!isInitGame) {
    initGame();
  }
});

async function initGame() {
  if (isInitGame) return;

  await sendEvent(2);

  loadGoldBalance(); // 골드 잔액 동기화
  loadCurrentStage(); // 현재 스테이지 동기화

  // monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화
  placeBase(); // 기지 배치
  startStageButton.style.display = 'block'; // 준비 완료 버튼 표시
  gameLoop(); // 게임 루프 시작

  isInitGame = true;
}

async function stageInit(currentStageId) {
  // 인수로 받은 해당 스테이지에 맞게 몬스터 생성
  initSpawnQueue(currentStageId); // 몬스터 소환 큐 초기화

  const result = await sendEvent(201); // 스테이지 시작 신호
  // 스테이지 신호 서버로 날림
  if (result.status === 'fail') {
    cancelAnimationFrame(animationFrameId);
    alert('게임 오류 발생');
    location.reload(); // 게임 재시작
  }
}

async function startStage() {
  try {
    const startStageResult = await sendEvent(201);
    if (startStageResult.status === 'failure') {
      throw new Error(startStageResult.message);
    }
    loadCurrentStage(); // 서버에서 스테이지 받아옴
    cancelAnimationFrame(animationFrameId);
    isStageActive = true; // 스테이지 활성화
    await stageInit(currentStageId); // 스테이지 초기화 및 몬스터 생성 시작
    gameLoop();
    alert(`${currentStageNumber} 스테이지 시작!`);
  } catch (err) {
    cancelAnimationFrame(animationFrameId);
    sendEvent(3); // gameEnd 호출
    alert(`게임 오류 발생: ${err.message}`);
    location.reload(); // 게임 재시작
  }
}

async function endStage() {
  try {
    isStageActive = false; // 스테이지 비활성화
    // alert(`스테이지 ${currentStageNumber} 완료!`);
    const clearStageDiv = document.getElementById('clearStageDiv');
    clearStageDiv.style.display = 'block';

    setTimeout(() => {
      clearStageDiv.style.display = 'none';
    }, 2000);

    const stageEndResult = await sendEvent(202);

    if (stageEndResult.status === 'failure') {
      throw new Error(stageEndResult.message);
    }

    loadGoldBalance(); // 골드 잔액 동기화
    loadCurrentStage();

    startStageButton.style.display = 'block'; // 준비 완료 버튼 다시 표시
  } catch (err) {
    if (err.message === 'Last_Stage') {
      cancelAnimationFrame(animationFrameId);
      // 모든 버튼 숨김
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button) => {
        button.style.display = 'none';
      });
      const clearStageDiv = document.getElementById('clearStageDiv');
      const allClearStageDiv = document.getElementById('allClearStageDiv');
      clearStageDiv.style.display = 'none';
      allClearStageDiv.style.display = 'block';

      const gameEndButton = document.getElementById('gameEndButton');
      gameEndButton.style.display = 'block';
      gameEndButton.addEventListener('click', () => {
        location.reload();
      });
      const result = await sendEvent(202); // stageEnd 호출
      const result2 = await sendEvent(3); // gameEnd 호출
      console.log(result, result2);
    } else {
      cancelAnimationFrame(animationFrameId);
      await sendEvent(3); // gameEnd 호출
      alert(`게임 오류 발생: ${err.message}`);
      location.reload(); // 게임 재시작
    }
  }
}

async function endGame() {
  isStageActive = false;
  cancelAnimationFrame(animationFrameId);

  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    button.style.display = 'none';
  });

  const gameOverDiv = document.getElementById('gameOverDiv');

  gameOverDiv.style.display = 'block';

  const gameEndButton = document.getElementById('gameEndButton');
  gameEndButton.style.display = 'block';
  gameEndButton.addEventListener('click', () => {
    location.reload();
  });
  const result = await sendEvent(202); // stageEnd 호출
  const result2 = await sendEvent(3); // gameEnd 호출
  console.log(result, result2);
}

let isPlacingTower = false;
// 설치할 타워
let assetIdToPlace = null;
// 타워 클릭 모드 변수
let selectedTower = null;
const buyNormalTowerButton = document.createElement('button');
const buySlowTowerButton = document.createElement('button');
const buyMultiTowerButton = document.createElement('button');
const upgradeButton = document.createElement('button');
const sellButton = document.createElement('button');

initButton(
  buyNormalTowerButton,
  buySlowTowerButton,
  buyMultiTowerButton,
  upgradeButton,
  sellButton,
); // 버튼 세팅

// 노말타워 설치 버튼 이벤트 리스너
buyNormalTowerButton.addEventListener('click', () => {
  isPlacingTower = true; // 타워 설치 모드 활성화
  assetIdToPlace = TOWER_TYPE.NORMAL; // 설치할 타워 종류

  canvas.style.cursor = 'crosshair'; // 커서를 변경
});
// 슬로우타워 설치 버튼 이벤트 리스너
buySlowTowerButton.addEventListener('click', () => {
  isPlacingTower = true; // 타워 설치 모드 활성화
  assetIdToPlace = TOWER_TYPE.SLOW; // 설치할 타워 종류
  canvas.style.cursor = 'crosshair'; // 커서를 변경
});
// 멀티타워 설치 버튼 이벤트 리스너
buyMultiTowerButton.addEventListener('click', () => {
  isPlacingTower = true; // 타워 설치 모드 활성화
  assetIdToPlace = TOWER_TYPE.MULTI; // 설치할 타워 종류
  canvas.style.cursor = 'crosshair'; // 커서를 변경
});
// 타워 판매 버튼 이벤트 리스너
sellButton.addEventListener('click', async () => {
  if (!selectedTower) return;

  try {
    // 서버에 타워 판매 요청
    const response = await sendEvent(22, { towerId: selectedTower.id });
    if (response.status === 'failure') {
      alert(`판매 실패: ${response.message}`);
      return;
    }
    // 타워 삭제
    const deletedTower = deleteTower(selectedTower.id);

    loadGoldBalance();

    selectedTower = null;
    hideButton(upgradeButton);
    hideButton(sellButton);
    alert('타워가 판매되었습니다.');
  } catch (err) {
    console.error('Error occured in selling Tower:', err.message);
  }
});

// 타워 업그레이드 버튼 이벤트 리스너
upgradeButton.addEventListener('click', async () => {
  // 선택된 타워가 없다면 종료 (방어코드)
  if (!selectedTower) return;
  try {
    // 서버에 업그레이드 요청
    const response = await sendEvent(23, { towerId: selectedTower.id });

    if (response.status === 'failure') {
      alert(`업그레이드 실패: ${response.message}`);
      return;
    }
    // 업그레이드 성공시 로직
    selectedTower.applyUpgrades(response.payload);

    loadGoldBalance();

    if (selectedTower.level >= MAX_TOWER_LEVEL) {
      hideButton(upgradeButton);
    }
    alert('타워가 업그레이드되었습니다');
  } catch (err) {
    console.error('Error occured upgrade Tower:', err.message);
  }
});

// 화면 클릭 이벤트 리스너
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (1920 / rect.width);
  const y = (event.clientY - rect.top) * (1080 / rect.height);

  // 타워 설치 모드일 경우 새 타워 설치
  if (isPlacingTower) {
    if (isValidPlacement(x, y)) {
      placeNewTower(assetIdToPlace, { x, y });
      isPlacingTower = false;
      canvas.style.cursor = 'default';
    } else {
      alert('타워를 설치할 수 없는 위치입니다.');
    }
  } else {
    // 타워 선택 모드
    selectedTower = getTowerAtLocation(towers, x, y);
    if (selectedTower) {
      if (selectedTower.level < 3) {
        showButton(upgradeButton);
      }
      showButton(sellButton);
    } else {
      hideButton(upgradeButton);
      hideButton(sellButton);
    }
  }
});

/**
 * 타워 배치 함수
 * @param {Tower} TowerDataID
 * @param {{x: Number, y: Number}} spawnLocation 설치 좌표
 * @returns
 */
async function placeNewTower(assetId, spawnLocation) {
  let newTower = null;
  try {
    // 타워 구매 요청
    const response = await sendEvent(21, { towerId: assetId, spawnLocation: spawnLocation });

    // INCOMPLETE response 유효성 검사

    // 서버에서 생성된 타워의 Instance id
    const towerInstanceId = response.payload.towerId;

    // Client 측 타워 생성
    newTower = createTower(assetId, towerInstanceId, spawnLocation);
    setTower(newTower);
    newTower.draw(ctx);

    loadGoldBalance();
  } catch (err) {
    console.error('Error occured buying Tower:', err.message);
  }
}

function isValidPlacement(x, y) {
  // 타워 설치 위치 유효성 검증 함수. 일단은 타워끼리 겹치지 않도록
  for (const tower of towers) {
    const distance = Math.hypot(tower.x - x, tower.y - y);
    if (distance < 100) {
      // 최소 거리 제한 (타워 간의 거리)
      return false;
    }
  }
  return true;
}

const startStageButton = document.createElement('button');
startStageButton.textContent = '준비 완료';
startStageButton.style.position = 'absolute';
startStageButton.style.bottom = '10%';
startStageButton.style.left = '50%';
startStageButton.style.transform = 'translateX(-50%)';
startStageButton.style.padding = '10px 20px';
startStageButton.style.fontSize = '16px';
startStageButton.style.cursor = 'pointer';

// 준비 완료 버튼을 누르면 스테이지 시작
startStageButton.addEventListener('click', () => {
  clearStageDiv.style.display = 'none';
  startStage(); // 스테이지 시작 함수 호출
  startStageButton.style.display = 'none'; // 버튼 숨기기
});

document.body.appendChild(startStageButton);
