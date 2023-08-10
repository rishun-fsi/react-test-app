import Box from '@mui/material/Box';
import SelectForm from './SelectForm';
import RadioForm from './RadioForm';
import CheckForm from './CheckForm';
import { QuestionType, Question, QuestionItem } from '../interface/Question';
import { Answer } from '../interface/Answer';

type QuestionProps = {
  question: Question;
  answers: Answer[];
  updateAnswer: Function;
  addAnswer: Function;
  removeAnswer: Function;
  updateDiscriptionAnswer: Function;
};

const QuestionForm: React.FC<QuestionProps> = (props) => {
  const question: Question = props.question;
  const answers: Answer[] = props.answers;
  const updateAnswer: Function = props.updateAnswer;
  const addAnswer: Function = props.addAnswer;
  const removeAnswer: Function = props.removeAnswer;
  const updateDiscriptionAnswer: Function = props.updateDiscriptionAnswer;

  const headline: string = question.headline;
  const discription: string = question.question;
  const type: QuestionType = question.type;
  const items: QuestionItem[] = question.items;
  const required: boolean = question.required;

  return (
    <Box sx={{ marginTop: '0.5em' }}>
      <Box
        sx={{
          background: '#1976D2',
          color: '#FFFFFF',
          display: 'inline-block',
          padding: '0.5em',
          marginRight: '0.5em',
          borderRadius: '10px'
        }}
      >
        {headline}
      </Box>
      {discription}
      <br></br>
      {type === 'select' ? (
        <SelectForm
          answer={answers.length === 0 ? '' : String(answers[0].itemId)}
          updateAnswer={updateAnswer(question.id)}
          items={items}
          required={required}
        />
      ) : (
        <></>
      )}
      {type === 'radio' ? (
        <RadioForm
          answer={answers.length === 0 ? '' : String(answers[0].itemId)}
          updateAnswer={updateAnswer(question.id)}
          items={items}
          required={required}
        />
      ) : (
        <></>
      )}
      {type === 'check' ? (
        <CheckForm
          addAnswer={addAnswer(question.id)}
          removeAnswer={removeAnswer(question.id)}
          updateDiscriptionAnswer={updateDiscriptionAnswer(question.id)}
          answers={answers}
          items={items}
          required={required}
        />
      ) : (
        <></>
      )}
    </Box>
  );
};

export default QuestionForm;
