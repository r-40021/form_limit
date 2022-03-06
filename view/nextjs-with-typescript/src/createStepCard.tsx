import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { css } from '@linaria/core';
import Box from '@mui/material/Box';

type Props = {
    step: number,
    title: string,
    cardContent: JSX.Element
};

export default function StepCard({ step, title, cardContent }: Props) {
    const cardStyle = css`
    background-color: #fff;
  `;

    return (
        <Card
            sx={{
                my: 3,
                py: 1,
                px: 1
            }}
            className={cardStyle}
        >
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                    STEP {step}
                </Typography>
                <Typography variant='h5' component='div'>
                    {title}
                </Typography>
                <Box sx={{ mx: 1, my: 2 }}>
                    {cardContent}
                </Box>

            </CardContent>

        </Card>
    )
}