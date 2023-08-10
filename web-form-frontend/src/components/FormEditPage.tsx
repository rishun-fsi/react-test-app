import {
  useState,
  useEffect,
  ChangeEvent,
  Dispatch,
  SetStateAction
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Question,
  QuestionItem,
  QuestionResponse,
  GroupedQuestion,
  ExistingQuestion,
  ExistingQuestionItem,
  NewQuestion,
  NewQuestionItem
} from '../interface/Question';
import { fetchQuestions } from '../api';
import EditableQuestionnair from './EditableQuestionnair';
import {
  handleSelectChange,
  addQuestion,
  addQuestionItem,
  updateQuestionItem,
  switchOrder,
  deleteNewQuestion,
  deleteNewQuestionItem,
  updateQuestion
} from '../common/manageQuestion';

const deleteQuestion =
  (
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
  ) =>
  (index: number) =>
  () => {
    if (!('isDeleted' in questions[index])) {
      deleteNewQuestion(questions, setQuestions)(index)();
      return;
    }

    const filtered: (NewQuestion | ExistingQuestion)[] = questions.filter(
      (_, i: number) => index !== i
    );
    const deleted: ExistingQuestion = {
      ...(questions[index] as ExistingQuestion),
      isDeleted: true
    };
    setQuestions([...filtered, deleted]);
  };

const deleteQuestionItem =
  (
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
  ) =>
  (questionIndex: number, itemIndex: number) =>
  () => {
    if (!('isDeleted' in questions[questionIndex].items[itemIndex])) {
      deleteNewQuestionItem(questions, setQuestions)(
        questionIndex,
        itemIndex
      )();
      return;
    }

    const deleted = questions.map(
      (question: NewQuestion | ExistingQuestion, i: number) => {
        if (i !== questionIndex) return question;

        const filtered: (NewQuestionItem | ExistingQuestionItem)[] =
          question.items.filter((_, j: number) => j !== itemIndex);
        const deletedItem: ExistingQuestionItem = {
          ...(question.items[itemIndex] as ExistingQuestionItem),
          isDeleted: true
        };

        return {
          ...question,
          items: [...filtered, deletedItem]
        };
      }
    );

    setQuestions(deleted);
  };

const expandQuestionResponse = (
  questionResponse: QuestionResponse
): ExistingQuestion[] => {
  const flattened: Question[] = questionResponse
    .map((question: Question | GroupedQuestion): Question | Question[] => {
      if ('group' in question) {
        return question.questions;
      }

      return question;
    })
    .flat();

  return flattened.map(
    (question: Question): ExistingQuestion => ({
      ...question,
      items: question.items.map(
        (item: QuestionItem): ExistingQuestionItem => ({
          ...item,
          isDeleted: false
        })
      ),
      canInherit: false
    })
  );
};

const restoreQuestion =
  (
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
  ) =>
  (index: number) =>
  () => {
    const restored: (NewQuestion | ExistingQuestion)[] = questions.map(
      (question: NewQuestion | ExistingQuestion, i: number) => {
        if (i !== index) return question;

        return { ...question, isDeleted: false };
      }
    );

    const deletedQuestions = restored.filter(
      (question: NewQuestion | ExistingQuestion) =>
        'isDeleted' in question && question.isDeleted
    );
    const notDeletedQuestions = restored.filter(
      (question: NewQuestion | ExistingQuestion) =>
        !('isDeleted' in question && question.isDeleted)
    );

    setQuestions([...notDeletedQuestions, ...deletedQuestions]);
  };

const restoreQuestionItem =
  (
    questions: (NewQuestion | ExistingQuestion)[],
    setQuestions: Dispatch<SetStateAction<(NewQuestion | ExistingQuestion)[]>>
  ) =>
  (questionIndex: number, itemIndex: number) =>
  () => {
    const restored = questions.map(
      (question: NewQuestion | ExistingQuestion, i: number) => {
        if (i !== questionIndex) return question;

        const items: (NewQuestionItem | ExistingQuestionItem)[] =
          question.items.map(
            (item: NewQuestionItem | ExistingQuestionItem, j: number) => {
              if (j !== itemIndex) return item;

              return { ...item, isDeleted: false };
            }
          );

        const deletedItems: (NewQuestionItem | ExistingQuestionItem)[] =
          items.filter(
            (item: NewQuestionItem | ExistingQuestionItem) =>
              'isDeleted' in item && item.isDeleted
          );
        const notDeletedItems: (NewQuestionItem | ExistingQuestionItem)[] =
          items.filter(
            (item: NewQuestionItem | ExistingQuestionItem) =>
              !('isDeleted' in item && item.isDeleted)
          );

        return {
          ...question,
          items: [...notDeletedItems, ...deletedItems]
        };
      }
    );

    setQuestions(restored);
  };

const FormEditPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questionnairId: number = Number(location.pathname.split('/')[2]);
  const initialQuestionnairName: string | undefined =
    location.state === null
      ? undefined
      : (location.state.questionnairName as string);

  const [questionnairName, setQuestionnairName] = useState<string>('');
  const [questions, setQuestions] = useState<
    (ExistingQuestion | NewQuestion)[]
  >([]);

  useEffect(() => {
    if (!initialQuestionnairName) {
      navigate('/');
    } else {
      setQuestionnairName(initialQuestionnairName);
    }

    (async () => {
      const response: QuestionResponse = await fetchQuestions(
        questionnairId,
        true
      );
      setQuestions(expandQuestionResponse(response));
    })();
  }, [questionnairId, navigate, initialQuestionnairName]);

  return (
    <EditableQuestionnair
      questionnairName={questionnairName}
      handleChangeQuestionnairName={(event: ChangeEvent<HTMLInputElement>) => {
        setQuestionnairName(event.target.value as string);
      }}
      questions={questions}
      handleSelectChange={handleSelectChange(questions, setQuestions)}
      addQuestion={addQuestion(questions, setQuestions)}
      deleteQuestion={deleteQuestion(questions, setQuestions)}
      updateQuestion={updateQuestion(questions, setQuestions)}
      addQuestionItem={addQuestionItem(questions, setQuestions)}
      deleteQuestionItem={deleteQuestionItem(questions, setQuestions)}
      updateQuestionItem={updateQuestionItem(questions, setQuestions)}
      switchOrder={switchOrder(questions, setQuestions)}
      restoreQuestion={restoreQuestion(questions, setQuestions)}
      restoreQuestionItem={restoreQuestionItem(questions, setQuestions)}
    />
  );
};

export default FormEditPage;
