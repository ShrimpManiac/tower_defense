import { getAccount, updateAccount } from '../models/account.model.js';

/**
 * 계좌 조회
 *
 *
 * @param {string} uuid uuid(userId)
 * @returns {Object} 잔액 결과를 반환하는 객체
 */
export const checkBalanceAccount = (uuid) => {
  try {
    const balance = getAccount(uuid);

    if (balance === undefined) {
      throw new Error('Account not found');
    }

    return { status: 'success', message: 'Successfully checked your account balance', balance };
  } catch (err) {
    return { status: 'fail', message: err.message };
  }
};

/**
 * 계좌 입금
 *
 *
 * @param {string} uuid uuid(userId)
 * @param {number} amount  잔고에 입금하기 원하는 금액
 * @returns {Object} 입금 결과를 반환하는 객체
 */
export const depositAccount = (uuid, amount) => {
  try {
    const balance = getAccount(uuid);

    if (balance === undefined) {
      throw new Error('Account not found');
    }

    const result = updateAccount(uuid, balance + amount); // 잔액 최신화

    if (result.status === 'success') {
      return result; // { status: 'success', message: 'Account update successful', balance: Accounts[uuid] }
    } else {
      throw new Error('Deposit failed');
    }
  } catch (err) {
    return { status: 'fail', message: err.message };
  }
};

/**
 * 계좌 출금
 *
 *
 * @param {string} uuid uuid(userId)
 * @param {number} amount  잔고에 출금하기 원하는 금액
 * @returns {Object} 출금 결과를 반환하는 객체
 */
export const withdrawAccount = (uuid, amount) => {
  try {
    const balance = getAccount(uuid);

    if (balance === undefined) {
      throw new Error('Account not found');
    }

    if (balance < amount) throw new Error('Insufficient Balance'); // 출금 가능 여부 확인

    const result = updateAccount(uuid, balance - amount); // 잔액 최신화

    if (result.status === 'success') {
      return result; // { status: 'success', message: 'Account update successful', balance: Accounts[uuid] }
    } else {
      throw new Error('Withdraw failed');
    }
  } catch (err) {
    return { status: 'fail', message: err.message };
  }
};

/**
 * 구매 가능 금액인지 확인
 *
 *
 * @param {string} uuid uuid(userId)
 * @param {number} amount  구매하기 원하는 아이템의 금액
 * @returns {object} 충분한 잔액이 있는지 여부를 true/false로 반환
 */
export const hasSufficientBalance = (uuid, amount) => {
  try {
    const balance = getAccount(uuid);

    if (balance === undefined) {
      throw new Error('Account not found');
    }
    // 충분한 잔액이 있는지 여부를 true/false로 반환
    return { status: 'success', sufficient: balance >= amount };
  } catch (err) {
    return { status: 'fail', message: err.message };
  }
};
