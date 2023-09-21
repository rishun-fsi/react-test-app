import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import QuestionnairForm from './QuestionnairForm';
import { useLocation } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { fetchAnswersByMetadataId, updateAnswers } from '../../api';
import { addAnswer, getTempAnswers, removeAnswer } from '../../common/answer';
import {
  Answer,
  AnswerMasterForEdit,
  EditingAnswers,
  ExistingAnswer
} from '../../interface/Answer';

const removeAnswerInEdit =
  (
    answers: Answer[],
    initialAnswers: Answer[],
    setAnswers: Dispatch<SetStateAction<Answer[]>>,
    deletedIds: number[],
    setDeletedIds: Dispatch<SetStateAction<number[]>>
  ) =>
  (questionId: number) =>
  (itemId?: number) => {
    const initialAnswer: Answer | undefined = initialAnswers.find(
      (answer: Answer) =>
        answer.questionId === questionId && answer.itemId === itemId
    );
    if (
      initialAnswer !== undefined &&
      !deletedIds.includes(initialAnswer.answerId!)
    ) {
      setDeletedIds([...deletedIds, initialAnswer.answerId!]);
    }
    removeAnswer(answers, setAnswers)(questionId)(itemId);
  };

const addAnswerInEdit =
  (
    answers: Answer[],
    initialAnswers: Answer[],
    setAnswers: Dispatch<SetStateAction<Answer[]>>,
    deletedIds: number[],
    setDeletedIds: Dispatch<SetStateAction<number[]>>
  ) =>
  (questionId: number) =>
  (itemId?: number, textAnswer?: string) => {
    const initialAnswer: Answer | undefined = initialAnswers.find(
      (answer: Answer) =>
        answer.questionId === questionId &&
        answer.itemId === itemId &&
        answer.textAnswer === textAnswer
    );
    if (
      initialAnswer !== undefined &&
      deletedIds.includes(initialAnswer.answerId!)
    ) {
      setDeletedIds(
        deletedIds.filter((id: number) => id !== initialAnswer.answerId!)
      );
      setAnswers([...answers, initialAnswer]);
      return;
    }

    addAnswer(answers, setAnswers)(questionId)(itemId, textAnswer);
  };

const updateDescriptionAnswer =
  (
    answers: Answer[],
    initialAnswers: Answer[],
    setAnswers: Dispatch<SetStateAction<Answer[]>>,
    deletedIds: number[],
    setDeletedIds: Dispatch<SetStateAction<number[]>>
  ) =>
  (questionId: number) =>
  (textAnswer: string, itemId?: number) => {
    const initialAnswer: Answer | undefined = initialAnswers.find(
      (answer: Answer) =>
        answer.questionId === questionId && answer.itemId === itemId
    );
    const newAnswer: Answer = { questionId, itemId, textAnswer };

    const otherAnswers: Answer[] = answers.filter(
      (answer: Answer) =>
        answer.questionId !== questionId || answer.itemId !== itemId
    );
    if (initialAnswer !== undefined) {
      setAnswers([...otherAnswers, { ...initialAnswer, ...newAnswer }]);
      if (deletedIds.includes(initialAnswer.answerId!))
        setDeletedIds(
          deletedIds.filter((id: number) => id !== initialAnswer.answerId!)
        );
      return;
    }

    setAnswers([...otherAnswers, newAnswer]);
  };

const isEqualAnswer = (answer1: Answer, answer2: Answer) => {
  return (
    answer1.itemId === answer2.itemId &&
    answer1.textAnswer === answer2.textAnswer
  );
};

const formAnswer = (
  answers: Answer[],
  initialAnswers: Answer[],
  deletedIds: number[]
): EditingAnswers => {
  const existingAnswers: ExistingAnswer[] = answers
    .filter((answer: Answer) => answer.answerId !== undefined)
    .filter((answer: Answer) => {
      const initialAnswer: Answer = initialAnswers.find(
        (initialAnswer: Answer) => initialAnswer.answerId! === answer.answerId!
      )!;

      return !isEqualAnswer(answer, initialAnswer);
    })
    .map((answer: Answer) => ({
      answerId: answer.answerId!,
      itemId: answer.itemId,
      textAnswer: answer.textAnswer
    }));

  const newAnswers: Answer[] = answers.filter(
    (answer: Answer) => answer.answerId === undefined
  );

  return {
    existing: existingAnswers.length === 0 ? undefined : existingAnswers,
    new: newAnswers.length === 0 ? undefined : newAnswers,
    delete: deletedIds.length === 0 ? undefined : deletedIds
  };
};

const isEdited = (
  answers: Answer[],
  initialAnswers: Answer[],
  deletedIds: number[]
): boolean => {
  if (
    answers.length !== initialAnswers.length ||
    deletedIds.length !== 0 ||
    answers.some((answer: Answer) => answer.answerId === undefined)
  )
    return true;

  return !answers.every((answer: Answer) => {
    const initialAnswer: Answer = initialAnswers.find(
      (initial: Answer) => initial.answerId === answer.answerId
    )!;

    return isEqualAnswer(answer, initialAnswer);
  });
};

const AnswerEditPage: React.FC = () => {
  const location = useLocation();
  const questionnairId: number = Number(location.pathname.split('/')[2]);
  const metadataId: number = Number(location.pathname.split('/')[3]);

  const tempPath: string = `tempAnswer${questionnairId}-${metadataId}`;

  const [answers, setAnswers] = useState<Answer[]>(getTempAnswers(tempPath));
  const [initialAnswers, setInitialAnswers] = useState<Answer[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedInitialAnswers: Answer[] = await fetchAnswersByMetadataId(
        metadataId
      );
      if (answers.length === 0) setAnswers(fetchedInitialAnswers);
      setInitialAnswers(fetchedInitialAnswers);
    })();
  }, [metadataId]);

  const sendAnswer = async () => {
    const user = await Auth.currentAuthenticatedUser();

    const answerMaster: AnswerMasterForEdit = {
      answers: formAnswer(answers, initialAnswers, deletedIds),
      metadataId,
      userId: user.username,
      questionnairId
    };

    await updateAnswers(answerMaster);
  };

  return (
    <QuestionnairForm
      sendAnswer={sendAnswer}
      answers={answers}
      setAnswers={setAnswers}
      tempPath={tempPath}
      removeAnswer={removeAnswerInEdit(
        answers,
        initialAnswers,
        setAnswers,
        deletedIds,
        setDeletedIds
      )}
      addAnswer={addAnswerInEdit(
        answers,
        initialAnswers,
        setAnswers,
        deletedIds,
        setDeletedIds
      )}
      updateDescriptionAnswer={updateDescriptionAnswer(
        answers,
        initialAnswers,
        setAnswers,
        deletedIds,
        setDeletedIds
      )}
      isEdited={isEdited(answers, initialAnswers, deletedIds)}
      afterSubmitPage={`/form-answers-table/${questionnairId}`}
    />
  );
};

export default AnswerEditPage;
