import { useState, ChangeEvent } from 'react';
import { NewQuestion, SendingQuestion } from '../../interface/Question';
import EditableQuestionnair from './EditableQuestionnair';
import { Auth } from 'aws-amplify';
import {
  handleSelectChange,
  addQuestion,
  updateQuestion,
  addQuestionItem,
  updateQuestionItem,
  switchOrder,
  deleteNewQuestion,
  deleteNewQuestionItem
} from '../../common/manageQuestion';
import { Questionnair } from '../../interface/Questionnair';
import { Inheritance } from '../../interface/Inheritance';
import { postQuestionnair } from '../../api';

const createQuestionnair = async (
  questionnairName: string,
  questions: NewQuestion[],
  inheritance?: Inheritance
): Promise<Questionnair> => {
  const sendingQuestions: SendingQuestion[] = questions.map(
    (question: NewQuestion) => ({
      question: question.question,
      type: question.type,
      required: question.required,
      headline: question.headline,
      canInherit: question.canInherit,
      items: question.items
    })
  );
  const user = await Auth.currentAuthenticatedUser();

  return {
    userId: user.username,
    name: questionnairName,
    inheritance,
    questions: sendingQuestions
  };
};

const save =
  (
    questionnairName: string,
    questions: NewQuestion[],
    inheritance?: Inheritance
  ) =>
  async () => {
    const newQuestionnair: Questionnair = await createQuestionnair(
      questionnairName,
      questions,
      inheritance
    );

    await postQuestionnair(newQuestionnair);
  };

const FormCreatePage: React.FC = () => {
  const [questionnairName, setQuestionnairName] = useState<string>('');
  const [questions, setQuestions] = useState<NewQuestion[]>([]);
  const [inheritance, setInheritance] = useState<Inheritance>({
    isSameUser: true,
    questionId: 0
  });

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
      save={save}
      inheritance={inheritance}
      setInheritance={setInheritance}
    />
  );
};

export default FormCreatePage;
