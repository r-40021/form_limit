`use strict`

const propaty_display_limit = PropertiesService.getScriptProperties().getProperty("DISPLAY_LIMIT");
const propaty_max = Math.floor(PropertiesService.getScriptProperties().getProperty("MAX"));
const propaty_old = PropertiesService.getScriptProperties().getProperty("old");
let LIMIT_COUNT = propaty_max || propaty_max === 0 ? propaty_max : 5;//定員
let old_dis = propaty_old ? propaty_old : "";//古い定員の残り人数通知
let display_limit = Math.floor(propaty_display_limit || propaty_display_limit === 0 ? formatLimit(propaty_display_limit) : -1);//残りの枠を表示するしきい値
const kaigyo = "\n\n---------------------------------\n\n";//残り枠数のあとに追加される文字列


function endFormCheck(changed) {
  const form = FormApp.getActiveForm();//アクティブなフォーム
  const remaining = LIMIT_COUNT - form.getResponses().length;//残り人数
  const displayRemaining = remaining < 0 ? 0 : remaining;//残り人数が負の場合は0にする
  if ((display_limit === -1 || remaining <= display_limit) && Number(display_limit !== 0)) {
    const description = `定員${LIMIT_COUNT}名のところ、これまでに${form.getResponses().length}名が申し込みました。\n残りは${displayRemaining}枠です。` + (remaining < 0 ? `(超過${form.getResponses().length - LIMIT_COUNT})` : "");//定員があと何人か
    if (old_dis && form.getDescription().indexOf(old_dis) !== -1) {
      form.setDescription(form.getDescription().replace(old_dis, description));//概要文を書き換え
    } else {
      form.setDescription(description + kaigyo + form.getDescription());//新規
    }
    PropertiesService.getScriptProperties().setProperty("old", description);
  } else if (old_dis && form.getDescription().indexOf(old_dis) !== -1) {
    form.setDescription(form.getDescription().replace(old_dis + kaigyo, ""));//概要文を書き換え
  }
  if (form.getResponses().length >= LIMIT_COUNT) {
    if (changed === "changed" && form.isAcceptingResponses()) {
      FormApp.getUi().alert(`回答を締め切りました。\n現在の定員は${LIMIT_COUNT}名です`);//定員の変更によってフォームが閉鎖された場合に、ポップアップで通知
    }
    form.setAcceptingResponses(false);
  } else if (changed === "changed") {
    if (!form.isAcceptingResponses()) {
      /* 定員に余裕がある場合には、回答の収集を再開することを提案 */
      const ui = FormApp.getUi();
      const alert = ui.alert("回答の収集を再開", `回答の収集を再開しますか？\n現在の定員は${LIMIT_COUNT}人、残りは${remaining}枠です。`, ui.ButtonSet.YES_NO);
      if (alert === ui.Button.YES) {
        form.setAcceptingResponses(true);
      }
    } else if ((display_limit !== -1 && remaining > display_limit) || display_limit === 0) {
    /*フォームの説明欄に残りの人数が記述されない場合は、ポップアップでお知らせ*/
      FormApp.getUi().alert(`定員${LIMIT_COUNT}名\n残り${LIMIT_COUNT - form.getResponses().length}枠`);
    }

  }
}

function onOpen() {
  const ui = FormApp.getUi(); // Uiクラスを取得する
  const menu = ui.createMenu('定員制御');  // Uiクラスからメニューを作成する
  menu.addItem('定員を変更', 'setMax');   // メニューにアイテムを追加する
  menu.addItem('残りの枠数を表示するしきい値を変更', 'setDisplayLimit');
  menu.addItem('最新の状態に更新', 'refresh');   // メニューにアイテムを追加する
  menu.addToUi();// メニューをUiクラスに追加する
}

function refresh() {
  endFormCheck("changed");//更新用
}

function setMax() {
  /* 定員を変更 */
  const form = FormApp.getActiveForm();//アクティブなフォーム
  const ui = FormApp.getUi();
  const title = '定員の設定';
  const body = `半角数字で定員を入力してください。\n現在の定員は${LIMIT_COUNT}人で、残りは${LIMIT_COUNT - form.getResponses().length}枠です。`
  const prompt = ui.prompt(title, body, ui.ButtonSet.OK_CANCEL);//プロンプトを表示
  const text = prompt.getResponseText();
  if (prompt.getSelectedButton() === ui.Button.OK) {
    if (!isNaN(text) && Number(text) >= 0) {
    /*数字であることが確認された場合の処理*/
      if (!text) return;//空欄だった場合
      LIMIT_COUNT = Math.floor(Number(text));
      PropertiesService.getScriptProperties().setProperty("MAX", Math.floor(Number(text)));
      display_limit = Math.floor(propaty_display_limit || propaty_display_limit === 0 ? formatLimit(propaty_display_limit) : 0);
      refresh();
      return;
    } else {
      /* 数字じゃなかったら */
      const ui2 = FormApp.getUi();
      const title2 = 'むむ？';
      const body2 = Number(text) < 0 ? '0以上の数を半角で入力してください。' : '半角数字で入力してください。'
      const alert2 = ui2.alert(title2, body2, ui2.ButtonSet.OK);
      if (alert2 === ui2.Button.OK) setMax();
    }
  }
}

function setDisplayLimit() {
  /* しきい値を変更 */
  const form = FormApp.getActiveForm();//アクティブなフォーム
  const ui = FormApp.getUi();
  const title = '残りの枠数を表示するしきい値を設定';
  const body = `残りの枠数がいくつ以下になったら、回答者数・残りの枠数をフォームの概要文に表示するかを半角数字で入力してください。\n例）定員が100人で、残り5枠以下になったら残りの枠数をフォームの概要文に表示したい場合→「5」と入力する\n\nまた、残りの枠数が定員の○%以下になったら、というように設定することもできます。\n例）残りの枠数が定員の20%以下になったら残りの枠数をフォームの概要文に表示したい場合→「20%」と入力する\n\n概要文に常に残りの枠数を表示したい場合は、「-1」と入力してください。\n概要文に残りの枠数を表示させない場合は、「0」と入力してください。\n\n現在の設定は「${/%/.test(propaty_display_limit) ? propaty_display_limit : Math.floor(Number(propaty_display_limit))}」です。\n現在の定員は${LIMIT_COUNT}人、残りは${LIMIT_COUNT - form.getResponses().length}枠です。\n\n`;
  const prompt = ui.prompt(title, body, ui.ButtonSet.OK_CANCEL);//プロンプトを表示
  const text = prompt.getResponseText();
  if (prompt.getSelectedButton() === ui.Button.OK) {
    if (/%/.test(text)) {
      const onlyNum = text.replace("%", "");
      if (!isNaN(onlyNum) && Number(onlyNum) >= 0 && Number(onlyNum <= 100)) {
      /*パーセントで入力された場合*/
        if (!onlyNum) return;
        display_limit = formatLimit(text);//しきい値を変更
        PropertiesService.getScriptProperties().setProperty("DISPLAY_LIMIT", text);//しきい値を保存
        refresh();
        return
      }
    } else if (!isNaN(text) && Number(text) >= -1) {
      if (!text) return;//空欄だった場合
      display_limit = formatLimit(Number(text));
      PropertiesService.getScriptProperties().setProperty("DISPLAY_LIMIT", Math.floor(Number(text)));
      endFormCheck();
      return;
    } else {
      /* 数字じゃなかったら */
      const ui2 = FormApp.getUi();
      const title2 = 'むむ？';
      const body2 = "数字または割合(%)を半角で正確に入力してください。"
      const alert2 = ui2.alert(title2, body2, ui2.ButtonSet.OK);
      if (alert2 === ui2.Button.OK) setDisplayLimit();
    }
  }
}

function formatLimit(int) {
  if (/%/.test(int)) {
  /*％を実数に*/
    return Math.floor(LIMIT_COUNT * (Number(int.replace("%", "")) / 100));
  } else {
  /*%でなければ、小数点以下を切り捨てて戻す*/
    return Math.floor(int);
  }
}

