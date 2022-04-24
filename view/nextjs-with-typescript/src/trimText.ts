export default function trimText(string: string,start: string,end: string){
  const startIndex = string.indexOf(start) + start.length;
  const endIndex = string.indexOf(end);
  return string.substr(startIndex, endIndex - startIndex);
}