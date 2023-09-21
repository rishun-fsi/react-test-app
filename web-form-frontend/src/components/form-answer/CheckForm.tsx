import { ChangeEvent } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { QuestionItem } from '../../interface/Question';
import { Answer } from '../../interface/Answer';

type CheckFormProps = {
  answers: Answer[];
  addAnswer: Function;
  removeAnswer: Function;
  updateDescriptionAnswer: Function;
  items: QuestionItem[];
  questionId: number;
  required?: boolean;
};

const CheckForm: React.FC<CheckFormProps> = (props) => {
  const answers: Answer[] = props.answers;
  const addAnswer: Function = props.addAnswer;
  const removeAnswer: Function = props.removeAnswer;
  const updateDescriptionAnswer: Function = props.updateDescriptionAnswer;
  const items: QuestionItem[] = props.items;
  const questionId: number = props.questionId;
  const required: boolean =
    props.required !== undefined ? props.required : false;

  const getTextAnswer = (itemId: number): string => {
    const answer: Answer[] = answers.filter(
      (answer: Answer) =>
        answer.questionId === questionId && answer.itemId === itemId
    );
    return answer.length === 1 ? answer[0].textAnswer! : '';
  };

  const handleCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked: boolean = event.target.checked;
    const itemId: number = Number(event.target.name);
    const isDescription: boolean = items.filter(
      (item: QuestionItem) => item.id === itemId
    )[0].isDescription;
    const textAnswer: string = getTextAnswer(itemId);

    // 記述式ではなく、チェックが入った場合
    if (isChecked && !isDescription) {
      addAnswer(itemId);
      // 記述式であり、チェックが入った場合
    } else if (
      isChecked &&
      isDescription &&
      textAnswer !== '' &&
      textAnswer !== undefined
    ) {
      addAnswer(itemId, textAnswer);
    } else {
      removeAnswer(itemId);
    }
  };

  const handleTextAnswerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value;
    const itemId: number = Number(event.target.name);

    if (text !== '') {
      updateDescriptionAnswer(text, itemId);
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
          if (item.isDescription) {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleCheckChange}
                    name={String(item.id)}
                    checked={getTextAnswer(item.id) !== ''}
                    sx={checkboxStyle}
                  />
                }
                label={
                  <TextField
                    variant="outlined"
                    value={getTextAnswer(item.id)}
                    name={String(item.id)}
                    onChange={handleTextAnswerChange}
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
                  checked={
                    answers.filter(
                      (answer: Answer) =>
                        answer.questionId === questionId &&
                        answer.itemId === item.id
                    ).length === 1
                  }
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
