import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { QuestionItem } from '../interface/Question';

type SelectFormProps = {
  answer: string;
  updateAnswer: Function;
  items: QuestionItem[];
  required?: boolean;
};

const SelectForm: React.FC<SelectFormProps> = (props) => {
  const answer: string = props.answer;
  const updateAnswer: Function = props.updateAnswer;
  const required: boolean =
    props.required !== undefined ? props.required : false;
  const items: QuestionItem[] = props.items;

  const handleSelectChange = (event: SelectChangeEvent) => {
    const itemId = Number(event.target.value);
    updateAnswer(itemId);
  };

  const isError = answer === '' && required;

  return (
    <FormControl sx={{ width: '30%', marginTop: '0.5em' }} error={isError}>
      <Select
        labelId="select-label"
        value={answer}
        onChange={handleSelectChange}
      >
        {items.map((item: QuestionItem) => (
          <MenuItem key={item.id} value={String(item.id)}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      {isError ? <FormHelperText>1つ選択してください</FormHelperText> : <></>}
    </FormControl>
  );
};

export default SelectForm;
