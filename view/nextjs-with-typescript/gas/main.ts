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
const getItem = (item: GoogleAppsScript.Forms.Item) :any => {
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
  console.log(result)
  return result;
}

function saveData(data: SaveData) {
  PropertiesService.getScriptProperties().setProperty('data', JSON.stringify(data));
}

function getSaveData(): SaveData {
  return JSON.parse(PropertiesService.getScriptProperties().getProperty('data') || '{}');
}

export { }