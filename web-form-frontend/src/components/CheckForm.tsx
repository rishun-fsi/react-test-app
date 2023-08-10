import { useState, ChangeEvent } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { QuestionItem } from '../interface/Question';
import { Answer } from '../interface/Answer';

type CheckFormProps = {
  answers: Answer[];
  addAnswer: Function;
  removeAnswer: Function;
  updateDiscriptionAnswer: Function;
  items: QuestionItem[];
  required?: boolean;
};

type Others = {
  [key: number]: string;
};

const CheckForm: React.FC<CheckFormProps> = (props) => {
  const answers: Answer[] = props.answers;
  const addAnswer: Function = props.addAnswer;
  const removeAnswer: Function = props.removeAnswer;
  const updateDiscriptionAnswer: Function = props.updateDiscriptionAnswer;
  const items: QuestionItem[] = props.items;
  const required: boolean =
    props.required !== undefined ? props.required : false;

  const [others, setOthers] = useState<Others>(
    items
      .filter((item: QuestionItem) => item.isDiscription)
      .reduce(
        (accumulator: Others, item: QuestionItem): Others => ({
          [item.id]: ''
        }),
        {}
      )
  );

  const handleCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked: boolean = event.target.checked;
    const itemId: number = Number(event.target.name);
    const isDiscription: boolean = items.filter(
      (item: QuestionItem) => item.id === itemId
    )[0].isDiscription;

    if (isDiscription && !isChecked) {
      setOthers({ ...others, [itemId]: '' });
    }

    if (
      isChecked &&
      (!isDiscription || (isDiscription && others[itemId] !== ''))
    ) {
      addAnswer(itemId, others[itemId]);
    } else {
      removeAnswer(itemId);
    }
  };

  const handleOtherChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value;
    const itemId: number = Number(event.target.name);
    setOthers({ ...others, [itemId]: text });

    if (text !== '') {
      updateDiscriptionAnswer(itemId, text);
    } else {
      removeAnswer(itemId);
    }
  };

  const isError = answers.length === 0 && required;
  const checkboxStyle = { color: isError ? '#D43636' : '#535353' };

  return (
    <FormControl
      required={required}
      error={isError}
      component="fieldset"
      sx={{ m: 3 }}
      variant="standard"
    >
      <FormGroup>
        {items.map((item: QuestionItem) => {
          if (item.isDiscription) {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleCheckChange}
                    name={String(item.id)}
                    checked={others[item.id] !== ''}
                    sx={checkboxStyle}
                  />
                }
                label={
                  <TextField
                    variant="outlined"
                    value={others[item.id]}
                    name={String(item.id)}
                    onChange={handleOtherChange}
                    label={item.name}
                  />
                }
                key={item.id}
              />
            );
          }

          return (
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleCheckChange}
                  name={String(item.id)}
                  sx={checkboxStyle}
                />
              }
              label={item.name}
              key={item.id}
            />
          );
        })}
      </FormGroup>
      {isError ? (
        <FormHelperText>1つ以上選択してください</FormHelperText>
      ) : (
        <></>
      )}
    </FormControl>
  );
};

export default CheckForm;
