import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { NextPage } from 'next';
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import StepCard from '../src/createStepCard';
import ChoiceList from '../src/choiceList';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DoneIcon from '@mui/icons-material/Done';
import { QuestionList, QuestionListItems, SaveData, TmpLimitData } from '../src/interface';
import SettingSnackBar from '../src/SnackBar';



const Home: NextPage = () => {
  /* 設問リスト関連 */
  const baseQuestionList: QuestionListItems = { id: 0, title: 'フォーム全体', type: 'none', choices: ['フォーム全体'] }; //設問リストの初期値
  const [question, selectQuestion] = React.useState<QuestionListItems>(baseQuestionList); // 現在選択中の設問
  const [squeezedQuestionList, setSqueezedQuestionList] = React.useState<Array<QuestionListItems>>([baseQuestionList]); // 選択式に絞った設問リスト
  const tmpQuestionID = React.useRef<number>(); //セーブデータから読み取った選択中の設問のID

  /* 選択肢ごとの定員 */
  const [tmpLimitData, updateTempLimitData] = React.useState<TmpLimitData>({});

  /* 残り枠数の表示条件関連 */
  const [nowLimit, changeLimit] = React.useState<string>('always'); // 残り枠数の表示条件
  const defaultControlledNum = React.useRef<Number>();

  /* GAS用 */
  const saveData = React.useRef<SaveData>(); // GAS に送るデータ

  /* スナックバー関連 */
  const [openSaving, setOpenSaving] = React.useState(false); // スナックバーが開いているかどうか
  const [openforPre, setOpenforPre] = React.useState(false); // 準備中のスナックバーが開いているかどうか

  /**
   * STEP 1のプルダウンメニューがユーザーによって変更された時の処理
   * @param {SelectChangeEvent<number>} event onchangeイベントのオブジェクト
   */
  const handleChange = (event: SelectChangeEvent<number>): void => {
    selectQuestion(squeezedQuestionList.find((elem: QuestionListItems) => elem.id === event.target.value) || baseQuestionList);
  };

  /**
   * STEP 3のラジオボタンがユーザーによって変更された時の処理
   * @param {SelectChangeEvent<string>} event onchangeイベントのオブジェクト
   */
  const handleChangeRadio = (event: SelectChangeEvent<string>): void => {
    if (/^controlled/.test(event.target.value) && defaultControlledNum.current) {
      changeLimit('controlled_' + defaultControlledNum.current);
    } else {
      changeLimit(event.target.value);
    }
  };

  /**
   * ｢適用｣ボタンが押されたときに、データをGASに送ってダイアログを閉じる関数
   */
  const handleClickDoneButton = () => {
    setOpenSaving(true);
    let limit = nowLimit;
    if (/^controlled/.test(nowLimit) && !defaultControlledNum) limit = 'always';
    saveData.current = {
      id: question.id,
      display: limit,
      limit: tmpLimitData[question.id]
    };
    google.script.run.withSuccessHandler(() => {
      google.script.host.close();
    }).saveData(saveData.current);
  }

  /**
   * 全設問のリストから、選択式の設問(＝定員が設定できる設問)を抽出する関数
   * @param {QuestionList} questionList 全設問のリスト
   */
  const squeezeQuestionList = (questionList: QuestionList) => {
    const newSqueezedQuestionList = squeezedQuestionList.concat(questionList.items.filter((elem: QuestionListItems): Boolean => elem.choices.length > 0) || []);
    setSqueezedQuestionList(newSqueezedQuestionList);
    if (tmpQuestionID.current) selectQuestion(newSqueezedQuestionList.find(elem => elem.id === tmpQuestionID.current) || baseQuestionList);
    setOpenforPre(false);
  }

  /**
   * GAS用のセーブデータを、プログラムで使いやすいようにいくつかの変数に分割する関数
   * @param {SaveData} data GASに保存していたセーブデータのJSON
   */
  const splitSaveData = (data: SaveData) => {
    const questionItem = squeezedQuestionList.find(elem => elem.id === data.id);
    if (questionItem) {
      selectQuestion(questionItem);
    } else {
      selectQuestion(baseQuestionList);
      tmpQuestionID.current = data.id;
    }
    let limit = data.display;
    const limitNum = data.display.split('_')[1];
    if (/^controlled/.test(data.display) && !limitNum) limit = 'always';
    changeLimit(limit);
    if (/^controlled/.test(data.display) && limitNum) defaultControlledNum.current = parseInt(limitNum);
    let limitData: TmpLimitData = {};
    limitData[data.id] = data.limit;
    updateTempLimitData(limitData);
  }

  /**
   * 残り枠数の表示条件のテキストボックスからフォーカスを外れた際に、数値の検証＆保存をする関数
   * @param {React.FocusEvent<HTMLInputElement>} e blurイベントの引数
   */
  const handleBlurLimit = (e: React.FocusEvent<HTMLInputElement>) => {
    const value: number = parseInt(e.target.value);
    if (value < 1) {
      e.target.value = '1';
    }
    if (/\./.test(e.target.value)) {
      e.target.value = Math.floor(value).toString();
    }
    changeLimit('controlled_' + e.target.value);
    defaultControlledNum.current = parseInt(e.target.value);
  }

  React.useEffect(() => {
    setOpenforPre(true); // ｢読み込んでいます…｣を表示
    google.script.run.withSuccessHandler(squeezeQuestionList).getQuestions();
    google.script.run.withSuccessHandler(splitSaveData).getSaveData();
  }, []);

  return (
    <Container maxWidth='lg'>
      <GlobalStyles styles={{ body: { backgroundColor: '#f1f1f1' } }} />
      <StepCard
        step={1}
        title='定員を設ける対象を選択'
        cardContent=
        {
          <FormControl variant='filled'>
            <InputLabel id='question-label'>対象</InputLabel>
            <Select
              labelId='question-label'
              id='select-question'
              value={question.id}
              onChange={handleChange}
            >
              {
                squeezedQuestionList.map((value) => {
                  return (
                    <MenuItem value={value.id} key={value.id}>{value.title}</MenuItem>
                  )
                })
              }
            </Select>
            <FormHelperText>選択肢ごとに定員を設ける場合は、該当する設問を選択します。<br />フォーム全体の回答数を制限する場合は、「フォーム全体」を選択します。</FormHelperText>
          </FormControl>
        } />

      <StepCard step={2} title='定員を設定' cardContent={
        <ChoiceList choiceList={question.choices} {...{ question, tmpLimitData, updateTempLimitData }} />
      } />

      <StepCard step={3} title='残り枠数の表示条件を設定' cardContent={
        <FormControl>
          <RadioGroup
            value={nowLimit.split('_')[0]}
            name='conditions-for-displaying-the number'
            onChange={handleChangeRadio}
          >
            <FormControlLabel value='always' control={<Radio />} label='常に表示' />
            <FormControlLabel value='controlled' control={<Radio />} label='一定枠数以下になったら表示' />
            {/^controlled/.test(nowLimit) ?
              <TextField id='the-number' label='この枠数以下になったら表示' variant='filled' type='number' defaultValue={defaultControlledNum.current ? defaultControlledNum.current.toString() : nowLimit.split('_')[1]} onBlur={handleBlurLimit} />
              : ''
            }
            <FormControlLabel value='never' control={<Radio />} label='常に非表示' />
          </RadioGroup>
        </FormControl>
      } />
      <Box sx={{ pb: 3, textAlign: 'right' }}>
        <Button
          variant="contained"
          startIcon={<DoneIcon />}
          onClick={handleClickDoneButton}>
          適用
        </Button>
      </Box>
      <SettingSnackBar open={openforPre} setOpen={setOpenforPre} message='読み込んでいます…' />
      <SettingSnackBar open={openSaving} setOpen={setOpenSaving} message='設定しています…' />
    </Container >
  );
};

declare var google: any; // google.script 対策

export default Home;
