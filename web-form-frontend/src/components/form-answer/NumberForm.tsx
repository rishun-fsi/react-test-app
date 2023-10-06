import { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { isNumber } from '../../common';

type NumberFormProps = {
  addAnswer: Function;
  updateAnswer: Function;
  removeAnswer: Function;
  questionId: number;
  required?: boolean;
  answer: string;
};

const NumberForm: React.FC<NumberFormProps> = (props) => {
  const required: boolean =
    props.required === undefined ? false : props.required;
  const answer: string = props.answer;
  const isRequireError: boolean = required && answer === '';
  const isError: boolean = isRequireError || !isNumber(answer);

  const handleNumberChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (answer === undefined && event.target.value !== '') {
      props.addAnswer(undefined, event.target.value);
    }
    if (event.target.value === '') {
      props.removeAnswer();
      return;
    }
    props.updateAnswer(event.target.value);
  };

  return (
    <TextField
      variant="outlined"
      fullWidth
      placeholder="数字をこちらに入力してください。"
      value={answer}
      sx={{ marginTop: '0.5em' }}
      onChange={handleNumberChange}
      error={isError}
      helperText={`${isRequireError ? 'この質問は回答必須です。' : ''}${
        !isNumber(answer) ? '数字で回答を入力してください。' : ''
      }`}
    />
  );
};

export default NumberForm;
