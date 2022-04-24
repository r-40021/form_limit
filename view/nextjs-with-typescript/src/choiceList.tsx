import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { LimitList } from './interface';
import trimChoiceText from './trimText';

type Props = {
  choiceList: string[] | number[];
  saveLimitData: React.MutableRefObject<LimitList>;
}

export default function ChoiceList({ choiceList, saveLimitData }: Props) {

  /**
   * 入力された値が自然数か調べ、必要に応じて訂正する関数
   * @param {React.FocusEvent<HTMLInputElement>} e イベントの引数 
   */
  const checkNonnegativeInteger = (e: React.FocusEvent<HTMLInputElement>) => {
    const value: number = parseInt(e.target.value);
    if (value < 1) {
      e.target.value = '1';
    }
    if (/\./.test(e.target.value)) {
      e.target.value = Math.floor(value).toString();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const choice: string = e.target.id.replace('choice_', '');
    saveLimitData.current[choice] = parseInt(e.target.value);
  }

  return (
    <div>
      <FormHelperText>1以上の整数を入力してください。<br />定員を無制限にする場合は、空欄にしてください。</FormHelperText>
      <Grid container spacing={2} mt={2}>
        {
          choiceList.map((value: string | number) => {
            const choiceTitle: string = trimChoiceText(value.toString());
            return (
              <React.Fragment key={choiceTitle}>
                <Grid item sm={6} xs={12}>
                  <p>{choiceTitle}</p>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField id={'choice_' + choiceTitle} label='定員' variant='filled' type='number' size='small' onBlur={checkNonnegativeInteger} onChange={handleChange} />
                </Grid>
              </React.Fragment>
            );
          })
        }
      </Grid>
    </div>
  )
}