function onOpen() {
  var ui = FormApp.getUi();
  var menu = ui.createMenu('定員制御');
  menu.addItem('Modal', 'showModalDialog');
  menu.addToUi();
}

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
const getItem = item => {
  const itemType = item.getType();
  switch (itemType) {
    case FormApp.ItemType.TEXT:
      return item.asTextItem();
    case FormApp.ItemType.PARAGRAPH_TEXT:
      return item.asParagraphTextItem();
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
 * @param item 
 * @returns 
 */
const getChoices = item =>
  getItem(item).getChoices ? getItem(item).getChoices() : [];

function getQuestions() {
  const form = FormApp.getActiveForm();
  const items = form.getItems();
  const result: Form = { id: form.getId(), items: [] };
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const myItem: QuestionItem = {
      id: item.getId(),
      title: item.getTitle(),
      type: String(item.getType()),
      choices: getChoices(item).map(c => c.getValue())
    };
    result.items.push(myItem);
  }
  Logger.log(ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON)
  );
}

export { }