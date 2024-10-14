import { Base } from './base.js';
import { Monster } from './monster.js';
import { Tower } from './tower.js';
import '../init/socket.js';
import { sendEvent } from '../init/socket.js';
import { findAssetDataById } from '../utils/assets.js';
import { ASSET_TYPE } from '../constants.js';

/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/

let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const NUM_OF_MONSTERS = 5; // 몬스터 개수

let currentStageId = 0;
let currentStageNumber = 0;
let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 70; // 기지 체력

let towerCost = 0; // 타워 구입 비용
let numOfInitialTowers = 0; // 초기 타워 개수
let monsterLevel = 0; // 몬스터 레벨
let monsterSpawnInterval = 3000; // 몬스터 생성 주기
const spawnedMonsters = []; // 소환된 몬스터 목록
let monstersToSpawn = []; // 소환할 몬스터 목록
const towers = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const towerImage = new Image();
towerImage.src = 'images/tower.png';

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

    if (balance === undefined || response.status === 'fail') {
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

    if (!stageId === undefined || !stageNumber === undefined || response.status === 'fail') {
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

let monsterPath; // INCOMPLETE: 복수의 몬스터 경로를 허용하도록 구현할 필요가 있음

function generateRandomMonsterPath() {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width) {
      currentX = canvas.width;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentY > canvas.height) {
      currentY = canvas.height;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
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

function placeInitialTowers() {
  /* 
    타워를 초기에 배치하는 함수입니다.
    무언가 빠진 코드가 있는 것 같지 않나요? 
  */
  for (let i = 0; i < numOfInitialTowers; i++) {
    const { x, y } = getRandomPositionNearPath(200);
    const tower = new Tower(assetId, instanceId, { x, y }); // INCOMPLETE: 파라미터를 통해 타워 종류와 인스턴스ID 지정 필요
    tower.draw(ctx, towerImage);
  }
}

function placeNewTower() {
  /* 
    타워를 구입할 수 있는 자원이 있을 때 타워 구입 후 랜덤 배치하면 됩니다.
    빠진 코드들을 채워넣어주세요! 
  */
  const { x, y } = getRandomPositionNearPath(200);
  const tower = new Tower(assetId, instanceId, { x, y }); // INCOMPLETE: 파라미터를 통해 타워 종류와 인스턴스ID 지정 필요
  towers.push(tower);
  tower.draw(ctx, towerImage);
}

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

export function spawnMonster(instanceid) {
  for (let i = 0; i < monstersToSpawn.length; i++) {
    let monsterId = monstersToSpawn[i];
    spawnedMonsters.push(new Monster(monsterId, instanceid, monsterPath));
  }
}

function initSpawnQueue(StageId) {
  monstersToSpawn = [];
  let stageData = findAssetDataById(ASSET_TYPE.STAGE, StageId);
  console.log('스테이지 데이터: ', stageData);
  // 변수 설정
  let monsterIds = stageData.monsterIds;
  let numMonsters = stageData.numMonsters;
  let monsterProbabilitys = stageData.monsterProbabilitys;

  //랜덤으로 monstersToSpawn에 monseterId를 넣는 반복문
  for (let i = 0; i < numMonsters; i++) {
    const rand = Math.random(); // 랜덤함수
    let cumulativeRate = 0; // 누적확률
    // monsterProbabilitys에 따라 몬스터 선택
    for (let j = 0; j < monsterIds.length; j++) {
      cumulativeRate += monsterProbabilitys[j];
      if (rand < cumulativeRate) {
        let monsterId = monsterIds[j];
        monstersToSpawn.push(monsterId);
        break;
      }
    }
  }
  // 마지막 스테이지 보스 출현
  if (StageId === 4005) {
    monstersToSpawn.push(3004);
  }
  console.log('몬스터toSpawn: ', monstersToSpawn);
}
// function spawnMonster(assetId, instanceId) {
//   spawnedMonsters.push(new Monster(assetId, instanceId, monsterPath[0]));
// }

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
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 250); // 최고 기록 표시
}
let isStageActive = false; // 스테이지 진행 중 여부
let animationFrameId;

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  drawPath(monsterPath); // 경로 다시 그리기
  displayInfo(); // 게임 정보 표시

  // 타워 그리기 및 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImage);
    tower.updateCooldown();
    if (isStageActive) {
      spawnedMonsters.forEach((monster) => {
        const distance = Math.hypot(tower.x - monster.x, tower.y - monster.y);
        if (distance < tower.range) {
          tower.attack(monster);
        }
      });
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
          alert('게임 오버! 기지를 지키지 못했습니다...');
          cancelAnimationFrame(animationFrameId); // 애니메이션 루프 중지
          endGame();
        }
        monster.draw(ctx);
      } else {
        spawnedMonsters.splice(i, 1); // 몬스터 제거
      }
    }

    if (spawnedMonsters.length === 0) {
      endStage(); // 모든 몬스터 제거 시 스테이지 종료
    }
  }

  // 루프를 유지하기 위해 다음 프레임 요청
  animationFrameId = requestAnimationFrame(gameLoop);
}

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImage.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  if (!isInitGame) {
    initGame();
  }
});

function initGame() {
  if (isInitGame) return;

  loadGoldBalance(); // 골드 잔액 동기화
  loadCurrentStage(); // 현재 스테이지 동기화

  monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화
  placeBase(); // 기지 배치
  startStageButton.style.display = 'block'; // 준비 완료 버튼 표시
  gameLoop(); // 게임 루프 시작

  isInitGame = true;
}

async function startStage() {
  loadCurrentStage(); // 서버에서 스테이지 받아옴

  alert(`${currentStageNumber} 스테이지 시작!`);
  isStageActive = true; // 스테이지 활성화
  await stageInit(currentStageId); // 스테이지 초기화 및 몬스터 생성 시작
  gameLoop();
}

async function stageInit(currentStageId) {
  // 인수로 받은 해당 스테이지에 맞게 몬스터 생성
  console.log('currentStageId: ', currentStageId);
  initSpawnQueue(currentStageId); // 몬스터 소환 큐 초기화
  setInterval(); //

  const result = await sendEvent(201); // 스테이지 시작 신호
  // 스테이지 신호 서버로 날림
  if (result.status === 'fail') {
    cancelAnimationFrame(animationFrameId);
    alert('게임 오류 발생');
    location.reload(); // 게임 재시작
  }
}

async function endStage() {
  isStageActive = false; // 스테이지 비활성화
  alert(`스테이지 ${currentStageNumber} 완료!`);
  const stageEndResult = await sendEvent(202);
  loadGoldBalance(); // 골드 잔액 동기화
  loadCurrentStage();
  console.log(stageEndResult);
  if (stageEndResult.status === 'fail' && stageEndResult.message === 'Last_Stage') {
    cancelAnimationFrame(animationFrameId);
    alert(`스테이지를 모두 완료하셨습니다.!`);
    location.reload(); // 게임 재시작
  }
  startStageButton.style.display = 'block'; // 준비 완료 버튼 다시 표시
}

function endGame() {
  isStageActive = false;
  cancelAnimationFrame(animationFrameId);
  alert('게임 오버! 다시 도전해보세요.');
  location.reload(); // 게임 재시작
}

const buyTowerButton = document.createElement('button');
buyTowerButton.textContent = '타워 구입';
buyTowerButton.style.position = 'absolute';
buyTowerButton.style.top = '10px';
buyTowerButton.style.right = '10px';
buyTowerButton.style.padding = '10px 20px';
buyTowerButton.style.fontSize = '16px';
buyTowerButton.style.cursor = 'pointer';

buyTowerButton.addEventListener('click', placeNewTower);

document.body.appendChild(buyTowerButton);

const startStageButton = document.createElement('button');
startStageButton.textContent = '준비 완료';
startStageButton.style.position = 'absolute';
startStageButton.style.top = '50px';
startStageButton.style.right = '10px';
startStageButton.style.padding = '10px 20px';
startStageButton.style.fontSize = '16px';
startStageButton.style.cursor = 'pointer';

// 준비 완료 버튼을 누르면 스테이지 시작
startStageButton.addEventListener('click', () => {
  startStage(); // 스테이지 시작 함수 호출
  startStageButton.style.display = 'none'; // 버튼 숨기기
});

document.body.appendChild(startStageButton);
