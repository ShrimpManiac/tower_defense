![image](https://github.com/user-attachments/assets/ee127fd7-3d4f-46bc-a715-cb5cb4f3a42b)

# TOWER DEFENSE

## 프로젝트 개요

**TOWER DEFENSE**는 타워디펜스 게임을 모티브로 소켓통신을 공부하기 위하여 구현한 프로젝트입니다. 사용자는 포탑을 직접 설치하여 점수와 골드를 획득할 수 있습니다. 이 게임은 JavaScript, HTML, CSS로 작성되었으며, 재미있고 도전적인 경험을 제공합니다.

## 구현 기능 (도전 기능)
![image](https://github.com/user-attachments/assets/f533af7c-2623-4069-bda1-15f39c983799)
- **타워지정설치** - 타워의 위치를 랜덤이 아닌 플레이어가 지정한 위치에 설치
![image](https://github.com/user-attachments/assets/e3eb216d-4eab-4f63-942c-1b8d72942ad4)
- **업그레이드 및 환불** - 플레이어가 지정한 타워를 클릭하면 오른쪽 메뉴창에 업그레이드와 환불기능 활성화

- **타워, 몬스터 종류의 세분화 및 스테이지 시스템** - 스테이지 별 몬스터 세분화 및 공중, 보스 몬스터 출현, 타워의 종류를 세분화하여 타워마다의 특색을 구현
-![image](https://github.com/user-attachments/assets/4d768c83-3ec6-4cd3-9537-fceb7d367c2c)

- **기존 랜덤 경로가 아닌 고정경로 및 여러갈래길 구현** - 스테이지 별 몬스터 스폰위치 변경
![image](https://github.com/user-attachments/assets/7cff856b-3122-4958-b7d4-b7d300e3ef24)

## 게임 규칙

- 게임의 목적

  - 몰려드는 몬스터로부터 우리의 스파르타 기지를 방어하는 것이죠!
  - 공격은 최선의 방어! 타워로 몬스터를 처치하여 점수를 올리세요!

- 게임 오버

  - 스파르타 기지의 HP가 0이하가 되면 게임 오버입니다!

- 몬스터
  - 몬스터 처치를 할 때마다 정해진 점수가 오릅니다.
  - 몬스터 처치를 할 때마다 정해진 골드가 오릅니다.
  - 몬스터마다 체력, 공격력, 스피드가 각기 다릅니다.
- 타워
  - 타워는 몬스터를 처치할 수 있는 게임 내 유일한 수단입니다.
  - **초기 자본금으로 타워를 설치할 수 있습니다. (기존 타워 3개 랜덤설치 -> 자율)**
  - **유저가 서버에서 정해놓은 `타워 구입 비용`보다 골드가 많다면 골드를 소비하여 타워를 구입할 수 있어요.**
    - **구입한 타워는 원하는 위치에 설치할 수 있어요.**

## 기술 스택

- **HTML**: 게임의 기본 구조를 정의합니다.
- **CSS**: 게임의 스타일링과 레이아웃을 관리합니다.
- **JavaScript**: 게임 로직, 사용자 입력 처리 및 점수 관리.

## 설치 방법

이 프로젝트를 로컬 환경에서 실행하려면 아래 단계를 따르세요:

1. 이 저장소를 클론합니다:
   ```bash
   git clone https://github.com/ShrimpManiac/tower_defense.git
   ```
2. 클론한 디렉토리로 이동합니다:

   ```bash
   cd tower_defense
   ```

3. node_module을 설치합니다:

   ```bash
   npm install
   ```

4. .env파일에 DB 경로를 지정하고 prisma를 설정합니다:

   ```bash
   npx prisma db push;
   ```

5. node로 실행합니다:
   ```bash
   # node 바로 실행
   node ./src/app.js
   # pm2 이용 실행
   npx pm2 start ./src/app.js
   ```

## 사용 방법

1. 노드 서버 구동.
2. http://서버주소:3000 접속
3. 회원가입 후 로그인
4. 게임 플레이 버튼 누르면 게임 준비단계 돌입
5. 준비 단계에서 타워 배치가 끝나면 준비 완료 버튼 클릭
6. stage.json에 적힌 스테이지 만큼 기지의 체력을 지키면 성공
