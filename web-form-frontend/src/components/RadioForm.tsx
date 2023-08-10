import { ChangeEvent } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { QuestionItem } from '../interface/Question';

type RadioFormProps = {
  answer: string;
  updateAnswer: Function;
  items: QuestionItem[];
  required?: boolean;
};

const RadioForm: React.FC<RadioFormProps> = (props) => {
  const answer: string = props.answer;
  const updateAnswer: Function = props.updateAnswer;
  const items: QuestionItem[] = props.items;
  const required: boolean =
    props.required !== undefined ? props.required : false;

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const itemId = Number(event.target.value);
    updateAnswer(itemId);
  };

  const isError = answer === '' && required;

  return (
    <FormControl required={required} error={isError}>
      <RadioGroup
        row
        aria-labelledby="row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={handleRadioChange}
      >
        {items.map((item: QuestionItem) => (
          <FormControlLabel
            value={item.id}
            control={<Radio sx={{ color: isError ? '#D43636' : '#535353' }} />}
            label={item.name}
            key={item.id}
          />
        ))}
      </RadioGroup>
      {isError ? <FormHelperText>1つ選択してください</FormHelperText> : <></>}
    </FormControl>
  );
};

export default RadioForm;
