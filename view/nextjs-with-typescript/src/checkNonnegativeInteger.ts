import * as React from 'react';

/**
 * 入力された値が自然数か調べ、必要に応じて訂正する関数
 * @param {React.FocusEvent<HTMLInputElement>} e イベントの引数 
 */
export const checkNonnegativeInteger = (e: React.FocusEvent<HTMLInputElement>) => {
  const value: number = parseInt(e.target.value);
  if (value < 1) {
    e.target.value = '1';
  }
  if (/\./.test(e.target.value)) {
    e.target.value = Math.floor(value).toString();
  }
}

module.exports = checkNonnegativeInteger;