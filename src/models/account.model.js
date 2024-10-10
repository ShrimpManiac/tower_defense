const Accounts = {};

export const createAccount = (uuid) => {
  Accounts[uuid] = 0; // 새 계정 계좌를 0으로 초기화
};

export const getBalanceAccount = (uuid) => {
  return Accounts[uuid]; // uuid에 해당하는 계좌의 잔액 반환
};

export const depositAccount = (uuid, amount) => {
  if (Accounts[uuid] === undefined) throw new Error('Account Not Found'); // 계좌 존재 여부 확인
  return (Accounts[uuid] += amount); // 금액 추가 후 반환
};

export const withdrawAccount = (uuid, amount) => {
  if (Accounts[uuid] === undefined) throw new Error('Account Not Found'); // 계좌 존재 여부 확인
  if (Accounts[uuid] < amount) throw new Error('Insufficient Balance'); // 출금 가능 여부 확인
  return (Accounts[uuid] -= amount); // 금액 차감 후 반환
};

export const deleteAccount = (uuid) => {
  if (Accounts[uuid] === undefined) throw new Error('Account Not Found'); // 계좌 존재 여부 확인
  delete Accounts[uuid]; // 계좌 삭제
};
