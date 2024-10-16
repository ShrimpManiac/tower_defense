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
      throw new Error('Account not found in checkBalanceAccount');
    }

    return { status: 'success', message: 'Successfully checked your account balance', balance };
  } catch (err) {
    return { status: 'failure', message: err.message };
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
      throw new Error('Account not found in depositAccount');
    }

    const result = updateAccount(uuid, balance + Math.floor(amount)); // 잔액 최신화

    if (result.status === 'success') {
      return result; // { status: 'success', message: 'Account update successful', balance: Accounts[uuid] }
    } else {
      throw new Error('Deposit failed in depositAccount');
    }
  } catch (err) {
    return { status: 'failure', message: err.message };
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
      throw new Error('Account not found in withdrawAccount');
    }

    if (balance < amount) throw new Error('Insufficient Balance in withdrawAccount'); // 출금 가능 여부 확인

    const result = updateAccount(uuid, balance - Math.floor(amount)); // 잔액 최신화

    if (result.status === 'success') {
      return result; // { status: 'success', message: 'Account update successful', balance: Accounts[uuid] }
    } else {
      throw new Error('Withdraw failed in withdrawAccount');
    }
  } catch (err) {
    return { status: 'failure', message: err.message };
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
      throw new Error('Account not found in hasSufficientBalance');
    }
    // 충분한 잔액이 있는지 여부를 true/false로 반환
    return { status: 'success', sufficient: balance >= amount };
  } catch (err) {
    return { status: 'failure', message: err.message };
  }
};
