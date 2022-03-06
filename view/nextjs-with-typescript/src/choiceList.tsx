import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import * as React from 'react';

type Props = {
  choiceList: string[] | number[]
}

export default function ChoiceList({ choiceList }: Props) {
  return (
    <Grid container spacing={2}>
      {
        choiceList.map((value: string | number) => {
          return (
            <React.Fragment key={value}>
              <Grid item sm={6} xs={12}>
                <p>{value}</p>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField id={'choice_' + value} label='定員' variant='filled' type='number' size='small' />
              </Grid>
            </React.Fragment>
          );
        })
      }
    </Grid>
  )
}