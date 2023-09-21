import { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';

type TextFormProps = {
  addAnswer: Function;
  updateAnswer: Function;
  removeAnswer: Function;
  questionId: number;
  answer: string;
  required?: boolean;
};

const TextForm: React.FC<TextFormProps> = (props) => {
  const required: boolean =
    props.required === undefined ? false : props.required;
  const answer: string = props.answer;

  const isError: boolean = required && answer === '';

  return (
    <TextField
      variant="outlined"
      fullWidth
      placeholder="回答をこちらに入力してください。"
      value={answer}
      sx={{ marginTop: '0.5em' }}
      onChange={(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        if (answer === '' && event.target.value !== '') {
          props.addAnswer(undefined, event.target.value);
        }
        if (event.target.value === '') {
          props.removeAnswer();
          return;
        }
        props.updateAnswer(event.target.value);
      }}
      error={isError}
      helperText={
        isError ? 'この質問は回答必須です。回答を入力してください。' : ''
      }
    />
  );
};

export default TextForm;
