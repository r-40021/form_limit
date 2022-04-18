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



const Home: NextPage = () => {

  const [question, selectQuestion] = React.useState(0);
  const [nowLimit, changeLimit] = React.useState('always');

  const handleChange = (event: SelectChangeEvent<number>): void => {
    selectQuestion(event.target.value as number);
  };

  const handleChangeRadio = (event: SelectChangeEvent<string>): void => {
    changeLimit(event.target.value);
  };

  const handleClickDoneButton = () => {
    alert('Done!!');
  }

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
                value={question}
                onChange={handleChange}
              >
                <MenuItem value={0}>このフォーム全体</MenuItem>
                <MenuItem value={1}>1. お名前</MenuItem>
                <MenuItem value={2}>2. 時間帯</MenuItem>
                <MenuItem value={3}>3. 人数</MenuItem>
              </Select>
              <FormHelperText>選択肢ごとに定員を設ける場合は、該当する設問を選択します。<br />フォーム全体の回答数を制限する場合は、「このフォーム全体」を選択します。</FormHelperText>
            </FormControl>
          } />

        <StepCard step={2} title='定員を設定する' cardContent={
          <ChoiceList choiceList={['13~14時', '14~15時', '15~16時', '16~17時', '17~18時']} />
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


export default Home;
