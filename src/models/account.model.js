import { START_GOLD } from '../constants.js';

const Accounts = {};

export const createAccount = (uuid) => {
  Accounts[uuid] = START_GOLD; // 새 계정 계좌를 초기 지원금으로 초기화
  return { status: 'success', message: 'Account create successful' };
};

export const getAccount = (uuid) => {
  if (Accounts[uuid] === undefined) throw new Error('Account Not Found'); // 계좌 존재 여부 확인
  return Accounts[uuid]; // uuid에 해당하는 계좌의 잔액 반환
};

export const updateAccount = (uuid, amount) => {
  if (Number(amount) < 0) throw new Error('amount is less than 0');
  Accounts[uuid] = amount;
  return { status: 'success', message: 'Account update successful', balance: Accounts[uuid] };
};

export const deleteAccount = (uuid) => {
  if (Accounts[uuid] === undefined) throw new Error('Account Not Found'); // 계좌 존재 여부 확인
  delete Accounts[uuid]; // 계좌 삭제
  return { status: 'success', message: 'Account delete successful' };
};
