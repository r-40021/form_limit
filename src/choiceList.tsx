import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { LimitList, QuestionListItems, TmpLimitData } from './interface';
import trimChoiceText from './trimText';

type Props = {
  choiceList: string[] | number[];
  question: QuestionListItems;
  tmpLimitData: TmpLimitData;
  updateTempLimitData: React.Dispatch<React.SetStateAction<TmpLimitData>>;
}

export default function ChoiceList({ choiceList, question, tmpLimitData, updateTempLimitData }: Props) {
  /**
   * 一時的な保存データを更新する関数
   * @param {React.FocusEvent<HTMLInputElement>} e イベントの引数
   */
  const updateTmpData = (e: React.FocusEvent<HTMLInputElement>) => {
    const choice: string = e.target.id.replace('choice_', '');
    const inputNum = checkInputNum(e);
    e.target.value = inputNum;

    let tmpLimit: TmpLimitData = tmpLimitData;
    if (tmpLimit[question.id]) {
      tmpLimit[question.id][choice] = parseInt(inputNum);
    } else {
      let childrenData: LimitList = {};
      childrenData[choice] = parseInt(inputNum);
      tmpLimit[question.id] = childrenData;
    }
    updateTempLimitData(tmpLimit);
  };

  /**
   * テキストボックスに入力された内容に関して、それが適切なものであるかを検証し、必要に応じて正しい形式に直して返す関数。
   * @param {React.FocusEvent<HTMLInputElement>} e イベントの引数 
   * @returns {string} 整形後の文字列。必要に応じて元のテキストボックスに代入すると良い。
   */
  const checkInputNum = (e: React.FocusEvent<HTMLInputElement>): string => {
    const value: number = parseInt(e.target.value);
    if (value < 1) {
      return '1';
    }
    if (/\./.test(e.target.value)) {
      return Math.floor(value).toString();
    }
    return e.target.value;
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
                  <TextField id={'choice_' + choiceTitle} label='定員' variant='filled' type='number' size='small' defaultValue={tmpLimitData[question.id] ? tmpLimitData[question.id][choiceTitle] : ''} onBlur={updateTmpData} />
                </Grid>
              </React.Fragment>
            );
          })
        }
      </Grid>
    </div>
  )
}