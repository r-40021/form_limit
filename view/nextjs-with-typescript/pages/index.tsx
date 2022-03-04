import * as React from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { MdSettings } from 'react-icons/md';
import { cx } from '@linaria/core';
import { css } from '@linaria/atomic';

const atomicCss = css`
  background: red;
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;

const blueBackground = css`
  background: blue;
  border: 1px solid black;
`;


const Home: NextPage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 3
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
         <MdSettings />フォームの定員制御
        </Typography>

        <div className={cx(atomicCss, blueBackground)} />;
        
      </Box>
      
    </Container>
  );
};


export default Home;
