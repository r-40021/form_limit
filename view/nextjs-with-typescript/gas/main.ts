function onOpen() {
  var ui = FormApp.getUi();
  var menu = ui.createMenu('定員制御');
  menu.addItem('Modal', 'showModalDialog');
  menu.addToUi();
}

function showModalDialog() {
  var html = HtmlService.createTemplateFromFile('index').evaluate();
  FormApp.getUi().showModalDialog(html, "設定");
}

export{}