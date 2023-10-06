import {
  useState,
  useEffect,
  ChangeEvent,
  Dispatch,
  SetStateAction
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import {
  QuestionResponse,
  ExistingQuestion,
  ExistingQuestionItem,
  EditingQuestion,
  EditingQuestionItem,
  EditedQuestion,
  AddedQuestion,
  NewQuestion,
  EditedQuestionItem,
  AddedQuestionItem,
  NewQuestionItem
} from '../../interface/Question';
import { fetchQuestions, updateQuestionnair } from '../../api';
import EditableQuestionnair from './EditableQuestionnair';
import {
  handleSelectChange,
  addQuestion,
  addQuestionItem,
  updateQuestionItem,
  switchOrder,
  deleteNewQuestion,
  deleteNewQuestionItem,
  updateQuestion,
  completelyExpandQuestionResponse
} from '../../common/manageQuestion';
import { EditedQuestionnair } from '../../interface/Questionnair';
import { Inheritance } from '../../interface/Inheritance';

const deleteQuestion =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (setFocusingIndex: Dispatch<SetStateAction<number>>) =>
  (index: number) =>
  () => {
    if (!('isDeleted' in questions[index])) {
      deleteNewQuestion(questions, setQuestions)(setFocusingIndex)(index)();
      return;
    }

    const filtered: EditingQuestion[] = questions.filter(
      (_, i: number) => index !== i
    );
    const deleted: ExistingQuestion = {
      ...(questions[index] as ExistingQuestion),
      isDeleted: true
    };

    setFocusingIndex(questions.length - 1);
    setQuestions([...filtered, deleted]);
  };

const deleteQuestionItem =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (questionIndex: number, itemIndex: number) =>
  () => {
    if (!('isDeleted' in questions[questionIndex].items![itemIndex])) {
      deleteNewQuestionItem(questions, setQuestions)(
        questionIndex,
        itemIndex
      )();
      return;
    }

    const deleted = questions.map((question: EditingQuestion, i: number) => {
      if (i !== questionIndex) return question;

      const filtered: EditingQuestionItem[] = question.items!.filter(
        (_, j: number) => j !== itemIndex
      );
      const deletedItem: ExistingQuestionItem = {
        ...(question.items![itemIndex] as ExistingQuestionItem),
        isDeleted: true
      };

      return {
        ...question,
        items: [...filtered, deletedItem]
      };
    });

    setQuestions(deleted);
  };

const restoreQuestion =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (setFocusingIndex: Dispatch<SetStateAction<number>>) =>
  (index: number) =>
  () => {
    const restored: EditingQuestion[] = questions.map(
      (question: EditingQuestion, i: number) => {
        if (i !== index) return question;

        return { ...question, isDeleted: false };
      }
    );

    const deletedQuestions = restored.filter(
      (question: EditingQuestion) =>
        'isDeleted' in question && question.isDeleted
    );
    const notDeletedQuestions = restored.filter(
      (question: EditingQuestion) =>
        !('isDeleted' in question && question.isDeleted)
    );

    setFocusingIndex(notDeletedQuestions.length - 1);
    setQuestions([...notDeletedQuestions, ...deletedQuestions]);
  };

const restoreQuestionItem =
  (
    questions: EditingQuestion[],
    setQuestions: Dispatch<SetStateAction<EditingQuestion[]>>
  ) =>
  (questionIndex: number, itemIndex: number) =>
  () => {
    const restored = questions.map((question: EditingQuestion, i: number) => {
      if (i !== questionIndex) return question;

      const items: EditingQuestionItem[] = question.items!.map(
        (item: EditingQuestionItem, j: number) => {
          if (j !== itemIndex) return item;

          return { ...item, isDeleted: false };
        }
      );

      const deletedItems: EditingQuestionItem[] = items.filter(
        (item: EditingQuestionItem) => 'isDeleted' in item && item.isDeleted
      );
      const notDeletedItems: EditingQuestionItem[] = items.filter(
        (item: EditingQuestionItem) => !('isDeleted' in item && item.isDeleted)
      );

      return {
        ...question,
        items: [...notDeletedItems, ...deletedItems]
      };
    });

    setQuestions(restored);
  };

const getInititalQuestionItems = (
  initialQuestions: ExistingQuestion[],
  id: number
): ExistingQuestionItem[] | undefined => {
  const targetIndex: number = initialQuestions.findIndex(
    (question: ExistingQuestion) => question.id === id
  );

  return initialQuestions[targetIndex].items as
    | ExistingQuestionItem[]
    | undefined;
};

const extractAddedQuestions = (
  questions: EditingQuestion[]
): AddedQuestion[] => {
  return questions
    .map((question: EditingQuestion, index: number) => ({
      ...question,
      priority: index
    }))
    .filter(
      (question: EditingQuestion & { priority: number }) =>
        !('isDeleted' in question)
    )
    .map((question: NewQuestion & { priority: number }) => {
      const items: AddedQuestionItem[] | undefined =
        question.items === undefined
          ? undefined
          : question.items.map((item: NewQuestionItem, index: number) => ({
              ...item,
              priority: index + 1
            }));

      return {
        question: question.question,
        type: question.type,
        required: question.required,
        headline: question.headline,
        items,
        canInherit: question.canInherit,
        priority: question.priority
      };
    });
};

const extractEditedItems = (
  items?: EditingQuestionItem[],
  initialItems?: ExistingQuestionItem[]
): EditedQuestionItem[] | undefined => {
  if (items === undefined) return undefined;

  // 変更があった項目のIDを取得
  const editedItemIds: number[] = items
    .filter((item: EditingQuestionItem, index: number) => {
      if (!('isDeleted' in item)) return false;
      if (index > items.length - 1 || initialItems === undefined) return true;

      return !_.isEqual(item, initialItems[index]);
    })
    .filter((item: EditingQuestionItem) => 'isDeleted' in item)
    .map((item: EditingQuestionItem) => (item as ExistingQuestionItem).id);

  const extracted: EditedQuestionItem[] = items
    .map((item: EditingQuestionItem, index: number) => ({
      ...item,
      priority: index + 1
    }))
    .filter(
      (item: EditingQuestionItem & { priority: number }) =>
        'isDeleted' in item && editedItemIds.includes(item.id)
    )
    .map((item: EditingQuestionItem & { priority: number }) => ({
      id: (item as ExistingQuestionItem).id,
      name: item.name,
      isDescription: item.isDescription,
      isDeleted: (item as ExistingQuestionItem).isDeleted,
      priority: item.priority
    }));

  return extracted.length === 0 ? undefined : extracted;
};

const extractAddedItems = (
  items?: EditingQuestionItem[]
): AddedQuestionItem[] | undefined => {
  if (items === undefined) return undefined;

  const extracted: AddedQuestionItem[] = items
    .map((item: EditingQuestionItem, index: number) => ({
      ...item,
      priority: index + 1
    }))
    .filter(
      (item: EditingQuestionItem & { priority: number }) =>
        !('isDeleted' in item)
    );

  return extracted.length === 0 ? undefined : extracted;
};

const extractEditedQuestions = (
  questions: EditingQuestion[],
  initialQuestions: ExistingQuestion[]
): EditedQuestion[] => {
  // 変更があった質問のIDを取得
  const editedQuestionIds: number[] = questions
    .filter((question: EditingQuestion, index: number) => {
      if (index > initialQuestions.length - 1) return true;

      return !_.isEqual(question, initialQuestions[index]);
    })
    .filter((question: EditingQuestion) => 'isDeleted' in question)
    .map((question: EditingQuestion) => question.id);

  return questions
    .map((question: EditingQuestion, index: number) => ({
      ...question,
      priority: index
    }))
    .filter((question: EditingQuestion & { priority: number }) =>
      editedQuestionIds.includes(question.id)
    )
    .map((question: EditingQuestion & { priority: number }) => {
      const items =
        question.items === undefined
          ? undefined
          : {
              existing: extractEditedItems(
                question.items,
                getInititalQuestionItems(initialQuestions, question.id)
              ),
              new: extractAddedItems(question.items)
            };

      return {
        id: question.id,
        type: question.type,
        required: question.required,
        headline: question.headline,
        question: question.question,
        canInherit: question.canInherit,
        isDeleted: (question as ExistingQuestion).isDeleted,
        priority: question.priority,
        items:
          items === undefined ||
          (items.existing === undefined && items.new === undefined)
            ? undefined
            : items
      };
    });
};

const createEditedQuestionnair = (
  initialQuestions: ExistingQuestion[],
  questionnairId: number,
  questionnairName: string,
  questions: EditingQuestion[],
  inheritance?: Inheritance
): EditedQuestionnair => {
  const addedQuestions: AddedQuestion[] = extractAddedQuestions(questions);
  const editedQuestions: EditedQuestion[] = extractEditedQuestions(
    questions,
    initialQuestions
  );

  return {
    questionnairId,
    existing: editedQuestions.length === 0 ? undefined : editedQuestions,
    new: addedQuestions.length === 0 ? undefined : addedQuestions,
    inheritance,
    questionnairName
  };
};

const save =
  (initialQuestions: ExistingQuestion[], questionnairId: number) =>
  (
    questionnairName: string,
    questions: EditingQuestion[],
    inheritance?: Inheritance
  ) =>
  async () => {
    const editedQuestionnair: EditedQuestionnair = createEditedQuestionnair(
      initialQuestions,
      questionnairId,
      questionnairName,
      questions,
      inheritance
    );
    await updateQuestionnair(editedQuestionnair);
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
  const [initialQuestions, setInitialQuestions] = useState<ExistingQuestion[]>(
    []
  );
  const [questions, setQuestions] = useState<EditingQuestion[]>([]);
  const [inheritance, setInheritance] = useState<Inheritance>({
    isSameUser: true
  });
  const [initialInheritance, setInitialInheritance] = useState<Inheritance>({
    isSameUser: true
  });

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
      setInitialQuestions(completelyExpandQuestionResponse(response.questions));
      setQuestions(completelyExpandQuestionResponse(response.questions));
      if (response.inheritance) {
        setInheritance({ questionId: 0, ...response.inheritance });
        setInitialInheritance({ questionId: 0, ...response.inheritance });
      }
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
      save={save(initialQuestions, questionnairId)}
      canSave={
        !_.isEqual(questions, initialQuestions) ||
        !_.isEqual(inheritance, initialInheritance)
      }
      inheritance={inheritance}
      setInheritance={setInheritance}
    />
  );
};

export default FormEditPage;
