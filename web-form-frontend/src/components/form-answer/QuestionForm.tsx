import Box from '@mui/material/Box';
import SelectForm from './SelectForm';
import RadioForm from './RadioForm';
import CheckForm from './CheckForm';
import TextForm from './TextForm';
import { QuestionType, Question, QuestionItem } from '../../interface/Question';
import { Answer } from '../../interface/Answer';
import NumberForm from './NumberForm';

type QuestionProps = {
  question: Question;
  answers: Answer[];
  updateAnswer: Function;
  addAnswer: Function;
  removeAnswer: Function;
  updateDescriptionAnswer: Function;
};

const getItemId = (
  answers: Answer[],
  questionId: number
): number | undefined => {
  const index: number = answers.findIndex(
    (answer: Answer) => answer.questionId === questionId
  );

  if (index === -1) return undefined;

  return answers[index].itemId!;
};

const getTextAnswer = (answers: Answer[], questionId: number): string => {
  const index: number = answers.findIndex(
    (answer: Answer) => answer.questionId === questionId
  );

  if (index === -1) return '';

  return answers[index].textAnswer!;
};

const QuestionForm: React.FC<QuestionProps> = (props) => {
  const question: Question = props.question;
  const answers: Answer[] = props.answers;
  const updateAnswer: Function = props.updateAnswer;
  const addAnswer: Function = props.addAnswer;
  const removeAnswer: Function = props.removeAnswer;
  const updateDescriptionAnswer: Function = props.updateDescriptionAnswer;

  const headline: string = question.headline;
  const description: string = question.question;
  const type: QuestionType = question.type;
  const items: QuestionItem[] | undefined = question.items;
  const required: boolean = question.required;

  const createFormByType = (type: QuestionType): JSX.Element => {
    if (type === 'select') {
      return (
        <SelectForm
          answer={
            getItemId(answers, question.id) === undefined
              ? ''
              : String(getItemId(answers, question.id))
          }
          updateAnswer={updateAnswer(question.id)}
          items={items!}
          required={required}
        />
      );
    } else if (type === 'radio') {
      return (
        <RadioForm
          answers={answers}
          updateAnswer={updateAnswer(question.id)}
          items={items!}
          questionId={question.id}
          required={required}
        />
      );
    } else if (type === 'check') {
      return (
        <CheckForm
          addAnswer={addAnswer(question.id)}
          removeAnswer={removeAnswer(question.id)}
          updateDescriptionAnswer={updateDescriptionAnswer(question.id)}
          answers={answers}
          questionId={question.id}
          items={items!}
          required={required}
        />
      );
    } else if (type === 'number') {
      return (
        <NumberForm
          addAnswer={addAnswer(question.id)}
          removeAnswer={removeAnswer(question.id)}
          updateAnswer={updateDescriptionAnswer(question.id)}
          questionId={question.id}
          required={required}
          answer={getTextAnswer(answers, question.id)}
        />
      );
    }

    return (
      <TextForm
        addAnswer={addAnswer(question.id)}
        removeAnswer={removeAnswer(question.id)}
        updateAnswer={updateDescriptionAnswer(question.id)}
        questionId={question.id}
        required={required}
        answer={getTextAnswer(answers, question.id)}
      />
    );
  };

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
      {description}
      <br></br>
      {createFormByType(type)}
    </Box>
  );
};

export default QuestionForm;
