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
import { QuestionList, QuestionListItems, SaveData } from '../src/interface';
import SettingSnackBar from '../src/SnackBar';



const Home: NextPage = () => {
  const baseQuestionList: QuestionListItems = { id: 0, title: 'フォーム全体', type: 'none', choices: ['フォーム全体'] };

  const [question, selectQuestion] = React.useState<QuestionListItems>(baseQuestionList); // 現在選択中の設問
  const [nowLimit, changeLimit] = React.useState('always'); // 残り枠数の表示条件

  const saveData = React.useRef<SaveData>(); // GAS に送るデータ

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
    changeLimit(event.target.value);
  };

  /**
   * ｢適用｣ボタンが押されたときに、データをGASに送ってダイアログを閉じる関数
   */
  const handleClickDoneButton = () => {
    setOpen(true);
    google.script.host.close();
  }

  const [squeezedQuestionList, setSqueezedQuestionList] = React.useState<Array<QuestionListItems>>([baseQuestionList]); // 選択式に絞った設問リスト

  /**
   * 全設問のリストから、選択式の設問(＝定員が設定できる設問)を抽出する関数
   * @param {QuestionList} questionList 全設問のリスト
   */
  const squeezeQuestionList = (questionList: QuestionList) => {
    console.log(questionList);
    setSqueezedQuestionList(squeezedQuestionList.concat(questionList.items.filter((elem: QuestionListItems): Boolean => elem.choices.length > 0) || []));
  }
  React.useEffect(() => {
    google.script.run.withSuccessHandler(squeezeQuestionList).getQuestions();
  }, []);

  const [open, setOpen] = React.useState(false); // スナックバーが開いているかどうか

  return (
    <Container maxWidth='lg'>
      <GlobalStyles styles={{ body: { backgroundColor: '#f1f1f1' } }} />
      <StepCard
        step={1}
        title='定員を設ける対象を選ぶ'
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

      <StepCard step={2} title='定員を設定する' cardContent={
          <ChoiceList choiceList={question.choices} />
      } />

      <StepCard step={3} title='残り枠数の表示条件を設定する' cardContent={
        <FormControl>
          <RadioGroup
            defaultValue='always'
            name='conditions-for-displaying-the number'
            onChange={handleChangeRadio}
          >
            <FormControlLabel value='always' control={<Radio />} label='常に表示' />
            <FormControlLabel value='controlled' control={<Radio />} label='一定枠数以下になったら表示' />
            {nowLimit === 'controlled' ?
              <TextField id='the-number' label='この枠数以下になったら表示' variant='filled' type='number' />
              : ''
            }
            <FormControlLabel value='after0' control={<Radio />} label='常に非表示' />
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
      <SettingSnackBar {...{ open, setOpen }} />
    </Container >
  );
};

declare var google: any; // google.script 対策

export default Home;
