/**
 * 設問の選択肢の中から、残り枠数などの表示を取り除く関数
 * @param {string} string 切り取られる文字列
 * @returns {string} 切り取られた文字列
 */
export default function trimChoiceText(string: string): string{
  const start: string = 'ㅤ(全';
  const end: string = '枠空き)'
  const startIndexOf: number = string.indexOf(start);
  const endIndexOf: number = string.indexOf(end);
  if (startIndexOf === -1 || endIndexOf === -1) return string;
  const startIndex = startIndexOf + start.length;
  const endIndex = endIndexOf;
  return string.substr(startIndex, endIndex - startIndex);
}