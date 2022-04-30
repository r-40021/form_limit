import { SaveData } from '../src/interface';

function onOpen() {
  var ui = FormApp.getUi();
  var menu = ui.createMenu('定員制御');
  menu.addItem('設定', 'showModalDialog');
  menu.addToUi();
}

/**
 * 設定画面のダイアログを表示する関数
 */
function showModalDialog() {
  var html = HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setWidth(800)
    .setHeight(600);
  FormApp.getUi().showModalDialog(html, "設定");
}

interface QuestionItem {
  id: number;
  title: string;
  type: string;
  choices: string[];
}
interface AnswerItem {
  id: number;
  value: string;
  // valuesはチェックボックスの回答の際に利用する
  values: string[];
}
interface Form {
  id: string;
  items: Array<AnswerItem | QuestionItem>;
}

/**
 * 設問の選択肢を取得する関数
 * @param {GoogleAppsScript.Forms.Item} item 設問のオブジェクト 
 * @returns {GoogleAppsScript.Forms.MultipleChoiceItem | GoogleAppsScript.Forms.ListItem | GoogleAppsScript.Forms.CheckboxItem | {}} 選択肢が入ったオブジェクト
 */
const getItem = (item: GoogleAppsScript.Forms.Item): any => {
  const itemType = item.getType();
  switch (itemType) {
    case FormApp.ItemType.MULTIPLE_CHOICE:
      return item.asMultipleChoiceItem();
    case FormApp.ItemType.LIST:
      return item.asListItem();
    case FormApp.ItemType.CHECKBOX:
      return item.asCheckboxItem();
    default:
      return {};
  }
};

/**
 * 設問の選択肢を取得する関数
 * @param {GoogleAppsScript.Forms.Item} item 設問のオブジェクト
 * @returns {Object} 選択肢が入ったオブジェクト
 */
const getChoices = (item: GoogleAppsScript.Forms.Item): [] =>
  'getChoices' in getItem(item) ? getItem(item).getChoices() : [];


/**
 * 設問の一覧を返す関数
 * @returns {Form} 設問の一覧のJSON
 */
function getQuestions(): Form {
  const form = FormApp.getActiveForm();
  const items = form.getItems();
  const result: Form = { id: form.getId(), items: [] };
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const myItem: QuestionItem = {
      id: item.getId(),
      title: item.getTitle(),
      type: String(item.getType()),
      choices: getChoices(item).map((c: any) => c.getValue())
    };
    result.items.push(myItem);
  }
  return result;
}

function saveData(data: SaveData) {
  const oldData = JSON.parse(PropertiesService.getScriptProperties().getProperty('data') || '{}');
  const form = FormApp.getActiveForm();
  //選択肢の内容を初期化
  if ('id' in oldData) {
    const question = form.getItemById(oldData.id);
    const choices = getChoices(question).map((c: any) => c.getValue());
    const newChoices = choices.map((value: string) => trimChoiceText(value));
    getItem(question).setChoiceValue(newChoices);
  }
  PropertiesService.getScriptProperties().setProperty('data', JSON.stringify(data)); // データ保存
  const answers = form.getResponses();
  const questionsIndex = getQuestions().items.findIndex(value => value.id === data.id); // 何番目の質問か
  let volumeChoices: Array<Number> = [];
  answers.map((value: GoogleAppsScript.Forms.FormResponse) => {
    const response = value.getItemResponses()[questionsIndex].getResponse();
    if (Array.isArray(response)) {
      response.map((elem, index: number) => {
        let indexVolumeChoices = volumeChoices[index];
        if (indexVolumeChoices && typeof indexVolumeChoices === 'number') indexVolumeChoices++;
        else indexVolumeChoices = 1;
      })
    }

  })
}

function getSaveData(): SaveData {
  return JSON.parse(PropertiesService.getScriptProperties().getProperty('data') || '{}');
}
/**
 * 設問の選択肢の中から、残り枠数などの表示を取り除く関数
 * @param {string} string 切り取られる文字列
 * @returns {string} 切り取られた文字列
 */
function trimChoiceText(string: string): string {
  const start: string = 'ㅤ- 全';
  const end: string = '枠空き)'
  const startIndexOf: number = string.indexOf(start);
  const endIndexOf: number = string.indexOf(end);
  if (startIndexOf === -1 || endIndexOf === -1) return string;
  const startIndex = startIndexOf + start.length;
  const endIndex = endIndexOf;
  return string.substr(startIndex, endIndex - startIndex);
}

export { }