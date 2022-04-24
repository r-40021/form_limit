import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import * as React from 'react';

type Props = {
  choiceList: string[] | number[];
}

export default function ChoiceList({ choiceList }: Props) {
  const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const value: number = parseInt(e.target.value);
    if (value < 1) {
      e.target.value = '1';
    }
    if (/\./.test(e.target.value)) {
      e.target.value = Math.floor(value).toString();
    }
  }

  return (
    <div>
      <FormHelperText>1以上の整数を入力してください。<br />定員を無制限にする場合は、空欄にしてください。</FormHelperText>
      <Grid container spacing={2} mt={2}>
        {
          choiceList.map((value: string | number) => {
            return (
              <React.Fragment key={value}>
                <Grid item sm={6} xs={12}>
                  <p>{value}</p>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField id={'choice_' + value} label='定員' variant='filled' type='number' size='small' onBlur={handleChange} />
                </Grid>
              </React.Fragment>
            );
          })
        }
      </Grid>
    </div>
  )
}