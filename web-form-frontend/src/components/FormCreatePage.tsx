import { useState, ChangeEvent } from 'react';
import { NewQuestion } from '../interface/Question';
import EditableQuestionnair from './EditableQuestionnair';
import {
  handleSelectChange,
  addQuestion,
  updateQuestion,
  addQuestionItem,
  updateQuestionItem,
  switchOrder,
  deleteNewQuestion,
  deleteNewQuestionItem
} from '../common/manageQuestion';

const FormCreatePage: React.FC = () => {
  const [questionnairName, setQuestionnairName] = useState<string>('');
  const [questions, setQuestions] = useState<NewQuestion[]>([]);

  return (
    <EditableQuestionnair
      questionnairName={questionnairName}
      handleChangeQuestionnairName={(event: ChangeEvent<HTMLInputElement>) => {
        setQuestionnairName(event.target.value as string);
      }}
      questions={questions}
      handleSelectChange={handleSelectChange(questions, setQuestions)}
      addQuestion={addQuestion(questions, setQuestions)}
      deleteQuestion={deleteNewQuestion(questions, setQuestions)}
      updateQuestion={updateQuestion(questions, setQuestions)}
      addQuestionItem={addQuestionItem(questions, setQuestions)}
      deleteQuestionItem={deleteNewQuestionItem(questions, setQuestions)}
      updateQuestionItem={updateQuestionItem(questions, setQuestions)}
      switchOrder={switchOrder(questions, setQuestions)}
    />
  );
};

export default FormCreatePage;
