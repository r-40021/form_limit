import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import Typography from '@mui/material/Typography';
import { NextPage } from 'next';
import * as React from 'react';
import { css } from '@linaria/core';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';



const Home: NextPage = () => {
  const styles = {
    icon: css`
      vertical-align: -4px;
      margin-right: .5em;
    `,
    contentCard: css`
      background-color: #fff;
    `
  }

  const [question, selectQuestion] = React.useState('');

  const handleChange = (event: SelectChangeEvent<string>): void => {
    selectQuestion(event.target.value as string);
  };
  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <GlobalStyles styles={{ body: { backgroundColor: '#f1f1f1' } }} />
        <Card
          sx={{
            my: 3,
            py: 1,
            px: 1
          }}
          className={styles.contentCard}
        >
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              STEP 1
            </Typography>
            <Typography variant="h5" component="div">
              定員を設ける対象を選ぶ
            </Typography>
            <FormControl variant="filled" sx={{ mx: 1, my: 2, minWidth: '40%' }}>
              <InputLabel id="question-label">対象</InputLabel>
              <Select
                labelId="question-label"
                id="select-question"
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
          </CardContent>

        </Card>

        <Card
          sx={{
            my: 3,
            py: 1,
            px: 1
          }}
          className={styles.contentCard}
        >
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              STEP 2
            </Typography>
            <Typography variant="h5" component="div">
              定員を設定する
            </Typography>
            <Box sx={{ mx: 1, my: 2 }}>
              <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                  <p>1時～2時</p>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField id="filled-basic" label="定員" variant="filled" type="number" size='small' />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <p>2時～3時</p>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField id="filled-basic" label="定員" variant="filled" type="number" size='small' />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <p>2時～3時</p>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField id="filled-basic" label="定員" variant="filled" type="number" size='small' />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <p>2時～3時</p>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField id="filled-basic" label="定員" variant="filled" type="number" size='small' />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <p>2時～3時</p>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField id="filled-basic" label="定員" variant="filled" type="number" size='small' />
                </Grid>
              </Grid>
            </Box>
          </CardContent>

        </Card>

        <Card
          sx={{
            my: 3,
            py: 1,
            px: 1
          }}
          className={styles.contentCard}
        >
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              STEP 3
            </Typography>
            <Typography variant="h5" component="div">
              詳細設定を行う
            </Typography>
            <Box sx={{ mx: 1, my: 2 }}>
              <FormControlLabel control={<Checkbox defaultChecked />} label="あいうえお" />
            </Box>

          </CardContent>

        </Card>

      </Container>
    </React.Fragment>
  );
};


export default Home;
