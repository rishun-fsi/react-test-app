import { useState } from 'react';
import QuestionnairForm from './QuestionnairForm';
import { useLocation } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { submitNewAnswers } from '../../api';
import {
  getTempAnswers,
  removeAnswer,
  addAnswer,
  updateDescriptionAnswer
} from '../../common/answer';
import { Answer } from '../../interface/Answer';

const AnswerPage: React.FC = () => {
  const location = useLocation();
  const questionnairId: number = Number(location.pathname.split('/')[2]);

  const tempPath: string = `tempAnswer${questionnairId}`;

  const [answers, setAnswers] = useState<Answer[]>(getTempAnswers(tempPath));

  const sendAnswer = async () => {
    const user = await Auth.currentAuthenticatedUser();
    await submitNewAnswers({
      userId: user.username,
      questionnairId: questionnairId,
      answers
    });
  };

  return (
    <QuestionnairForm
      sendAnswer={sendAnswer}
      answers={answers}
      setAnswers={setAnswers}
      tempPath={tempPath}
      removeAnswer={removeAnswer(answers, setAnswers)}
      updateDescriptionAnswer={updateDescriptionAnswer(answers, setAnswers)}
      addAnswer={addAnswer(answers, setAnswers)}
    />
  );
};

export default AnswerPage;
