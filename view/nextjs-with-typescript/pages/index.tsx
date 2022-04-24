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
import { QuestionList, QuestionListItems } from '../src/interface';



const Home: NextPage = () => {
  const baseQuestionList: QuestionListItems = {id: 0, title: 'フォーム全体', type: 'none', choices: ['フォーム全体']};

  const [question, selectQuestion] = React.useState<QuestionListItems>(baseQuestionList);
  const [nowLimit, changeLimit] = React.useState('always');

  const handleChange = (event: SelectChangeEvent<number>): void => {
    selectQuestion(squeezedQuestionList.find((elem: QuestionListItems) => elem.id === event.target.value) || baseQuestionList);
  };

  const handleChangeRadio = (event: SelectChangeEvent<string>): void => {
    changeLimit(event.target.value);
  };

  const handleClickDoneButton = () => {
    google.script.host.close();
  }

  const [squeezedQuestionList, setSqueezedQuestionList] = React.useState<Array<QuestionListItems>>([baseQuestionList]);

  const squeezeQuestionList = (questionList: QuestionList) => {
    console.log(questionList);
    setSqueezedQuestionList(squeezedQuestionList.concat(questionList.items.filter((elem: QuestionListItems): Boolean => elem.choices.length > 0) || []));
  }
  React.useEffect(() => {
    google.script.run.withSuccessHandler(squeezeQuestionList).getQuestions();
  }, []);
  
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
            <FormHelperText>選択肢ごとに定員を設ける場合は、該当する設問を選択します。<br />フォーム全体の回答数を制限する場合は、「このフォーム全体」を選択します。</FormHelperText>
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
            <FormControlLabel value='after0' control={<Radio />} label='残り枠数が0になるまで非表示' />
          </RadioGroup>
        </FormControl>
      } />
      <Box sx={{ pb: 3, textAlign: 'right' }}>
        <Button
          variant="contained"
          startIcon={<DoneIcon />}
          onClick={handleClickDoneButton}>
          適用して閉じる
        </Button>
      </Box>
    </Container>
  );
};

declare var google: any; // google.script 対策

export default Home;
