import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Auth } from 'aws-amplify';
import {
  chunkUpsertAnswers,
  fetchAnswersByMetadataIds,
  fetchQuestions
} from '../../api';
import { completelyExpandQuestionResponse } from '../../common/manageQuestion';
import {
  createHeadersForFormat,
  formatAnswer,
  parseCSV
} from '../../common/csv';
import {
  QuestionResponse,
  ExistingQuestion,
  QuestionType
} from '../../interface/Question';
import { HeaderForFormat } from '../../interface/CSV';
import {
  Answer,
  ChunkUpsertAnswer,
  ChunkUpsertAnswerRequest,
  ExistingAnswer,
  ValidatingAnswer,
  ValidatingAnswerPerQuestion
} from '../../interface/Answer';

type FileImportButtonsProps = {
  canSelectFile: boolean;
  questionnairId: number;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
};

type ExistingAnswerFromCSV = { metadataId: number; answers: Answer[] };

const getQuestionType = (
  questions: ExistingQuestion[],
  questionId: number
): QuestionType =>
  questions.find((question: ExistingQuestion) => question.id === questionId)!
    .type;

const isModified =
  (answer: Answer) =>
  (existingAnswer: ValidatingAnswerPerQuestion): boolean =>
    existingAnswer.questionId === answer.questionId &&
    (existingAnswer.itemId !== answer.itemId ||
      existingAnswer.textAnswer !== answer.textAnswer);

const isCheckModified =
  (answer: Answer) =>
  (existingAnswer: ValidatingAnswerPerQuestion): boolean =>
    answer.questionId === existingAnswer.questionId &&
    answer.itemId === existingAnswer.itemId &&
    answer.textAnswer !== existingAnswer.textAnswer;

const isNewAnswer =
  (existingAnswers: ValidatingAnswerPerQuestion[]) =>
  (answer: Answer): boolean =>
    existingAnswers.find(
      (answerPerQuestion: ValidatingAnswerPerQuestion) =>
        answerPerQuestion.questionId === answer.questionId
    ) === undefined;

const isCheckNewAnswer =
  (existingAnswers: ValidatingAnswerPerQuestion[]) =>
  (answer: Answer): boolean =>
    existingAnswers.find(
      (answerPerQuestion: ValidatingAnswerPerQuestion) =>
        answerPerQuestion.questionId === answer.questionId &&
        answerPerQuestion.itemId === answer.itemId
    ) === undefined;

const isDeleted =
  (csvAnswerPerQuestions: Answer[]) =>
  (existingAnswerPerQuestion: ValidatingAnswerPerQuestion): boolean =>
    csvAnswerPerQuestions.find(
      (csvAnswerPerQuestion: Answer) =>
        csvAnswerPerQuestion.questionId === existingAnswerPerQuestion.questionId
    ) === undefined;

const isCheckDeleted =
  (csvAnswerPerQuestions: Answer[]) =>
  (existingAnswerPerQuestion: ValidatingAnswerPerQuestion): boolean =>
    csvAnswerPerQuestions.find(
      (csvAnswerPerQuestion: Answer) =>
        csvAnswerPerQuestion.questionId ===
          existingAnswerPerQuestion.questionId &&
        csvAnswerPerQuestion.itemId === existingAnswerPerQuestion.itemId
    ) === undefined;

const extractModifiedAnswer = (
  csvAnswers: ExistingAnswerFromCSV[],
  existingAnswers: ValidatingAnswer[],
  questions: ExistingQuestion[]
): ChunkUpsertAnswer[] => {
  return csvAnswers
    .map((csvAnswer: ExistingAnswerFromCSV) => {
      const existingAnswer: ValidatingAnswer = existingAnswers.find(
        (existing) => existing.metadataId === csvAnswer.metadataId
      )!;
      const existingAnswersExceptCheckType: ExistingAnswer[] = csvAnswer.answers
        .filter(
          (answer: Answer) =>
            getQuestionType(questions, answer.questionId) !== 'check'
        )
        .filter((answer: Answer) =>
          existingAnswer.answers.some(isModified(answer))
        )
        .map((answer: Answer) => {
          const answerId: number = existingAnswer.answers.find(
            (answerPerQuestion: ValidatingAnswerPerQuestion) =>
              answerPerQuestion.questionId === answer.questionId
          )!.answerId;

          return {
            answerId,
            itemId: answer.itemId,
            textAnswer: answer.textAnswer
          };
        });

      const checkTypeExistingAnswers: ExistingAnswer[] = csvAnswer.answers
        .filter(
          (answer: Answer) =>
            getQuestionType(questions, answer.questionId) === 'check'
        )
        .filter((answer: Answer) =>
          existingAnswer.answers.some(isCheckModified(answer))
        )
        .map((answer: Answer) => {
          const answerId: number = existingAnswer.answers.find(
            (answerPerQuestion: ValidatingAnswerPerQuestion) =>
              answerPerQuestion.questionId === answer.questionId &&
              answerPerQuestion.itemId === answer.itemId
          )!.answerId;

          return {
            answerId,
            itemId: answer.itemId,
            textAnswer: answer.textAnswer
          };
        });

      return {
        metadataId: csvAnswer.metadataId,
        existing: [
          ...existingAnswersExceptCheckType,
          ...checkTypeExistingAnswers
        ]
      };
    })
    .filter((modifiedAnswers) => modifiedAnswers.existing.length !== 0);
};

const extractAddedAnswers = (
  csvAnswers: ExistingAnswerFromCSV[],
  existingAnswers: ValidatingAnswer[],
  questions: ExistingQuestion[]
): ChunkUpsertAnswer[] => {
  return csvAnswers
    .map((csvAnswer: ExistingAnswerFromCSV) => {
      const existingAnswer: ValidatingAnswer = existingAnswers.find(
        (existing) => existing.metadataId === csvAnswer.metadataId
      )!;
      const newAnswersExceptCheckType: Answer[] = csvAnswer.answers
        .filter(
          (answer: Answer) =>
            getQuestionType(questions, answer.questionId) !== 'check'
        )
        .filter(isNewAnswer(existingAnswer.answers));

      const checkTypeNewAnswer: Answer[] = csvAnswer.answers
        .filter(
          (answer: Answer) =>
            getQuestionType(questions, answer.questionId) === 'check'
        )
        .filter(isCheckNewAnswer(existingAnswer.answers));

      return {
        metadataId: csvAnswer.metadataId,
        new: [...newAnswersExceptCheckType, ...checkTypeNewAnswer]
      };
    })
    .filter((newAnswers) => newAnswers.new.length !== 0);
};

const extractDeletedAnswers = (
  csvAnswers: ExistingAnswerFromCSV[],
  existingAnswers: ValidatingAnswer[],
  questions: ExistingQuestion[]
): ChunkUpsertAnswer[] => {
  return csvAnswers
    .map((csvAnswer: ExistingAnswerFromCSV) => {
      const existingAnswer: ValidatingAnswer = existingAnswers.find(
        (existing) => existing.metadataId === csvAnswer.metadataId
      )!;

      const deletedAnswerIdsExceptCheckType: number[] = existingAnswer.answers
        .filter(
          (answer: ValidatingAnswerPerQuestion) =>
            getQuestionType(questions, answer.questionId) !== 'check'
        )
        .filter(isDeleted(csvAnswer.answers))
        .map((answer: ValidatingAnswerPerQuestion) => answer.answerId);

      const CheckTypeDeletedAnswerIds: number[] = existingAnswer.answers
        .filter(
          (answer: ValidatingAnswerPerQuestion) =>
            getQuestionType(questions, answer.questionId) === 'check'
        )
        .filter(isCheckDeleted(csvAnswer.answers))
        .map((answer: ValidatingAnswerPerQuestion) => answer.answerId);

      return {
        metadataId: csvAnswer.metadataId,
        delete: [
          ...deletedAnswerIdsExceptCheckType,
          ...CheckTypeDeletedAnswerIds
        ]
      };
    })
    .filter((deletedAnswers) => deletedAnswers.delete.length !== 0);
};

const getMetadataId = (answer: ChunkUpsertAnswer): number => answer.metadataId!;
const findAnswerByMetadataId =
  (metadataId: number) =>
  (answer: ChunkUpsertAnswer): boolean =>
    answer.metadataId === metadataId;

const extractExisting = (
  modifiedAnswers: ChunkUpsertAnswer[],
  metadataId: number
): ExistingAnswer[] | undefined => {
  const target: ChunkUpsertAnswer | undefined = modifiedAnswers.find(
    findAnswerByMetadataId(metadataId)
  );
  if (target === undefined) return undefined;

  return target.existing;
};

const extractNew = (
  addedAnswers: ChunkUpsertAnswer[],
  metadataId: number
): Answer[] | undefined => {
  const target: ChunkUpsertAnswer | undefined = addedAnswers.find(
    findAnswerByMetadataId(metadataId)
  );
  if (target === undefined) return undefined;

  return target.new;
};

const extractDelete = (
  deletedAnswers: ChunkUpsertAnswer[],
  metadataId: number
): number[] | undefined => {
  const target: ChunkUpsertAnswer | undefined = deletedAnswers.find(
    findAnswerByMetadataId(metadataId)
  );
  if (target === undefined) return undefined;

  return target.delete;
};

const formAnswers = (
  csvAnswers: ExistingAnswerFromCSV[],
  newAnswers: Answer[][],
  existingAnswers: ValidatingAnswer[],
  questions: ExistingQuestion[]
): ChunkUpsertAnswer[] => {
  const modifiedAnswers: ChunkUpsertAnswer[] = extractModifiedAnswer(
    csvAnswers,
    existingAnswers,
    questions
  );
  const addedAnswers: ChunkUpsertAnswer[] = extractAddedAnswers(
    csvAnswers,
    existingAnswers,
    questions
  );
  const deletedAnswers: ChunkUpsertAnswer[] = extractDeletedAnswers(
    csvAnswers,
    existingAnswers,
    questions
  );

  const metadataIds: number[] = Array.from(
    new Set([
      ...modifiedAnswers.map(getMetadataId),
      ...addedAnswers.map(getMetadataId),
      ...deletedAnswers.map(getMetadataId)
    ])
  );

  return [
    ...metadataIds.map((metadataId: number) => ({
      metadataId,
      existing: extractExisting(modifiedAnswers, metadataId),
      new: extractNew(addedAnswers, metadataId),
      delete: extractDelete(deletedAnswers, metadataId)
    })),
    ...newAnswers.map((newAnswer: Answer[]) => ({ new: newAnswer }))
  ];
};

const FileImportButtons: React.FC<FileImportButtonsProps> = (props) => {
  const [fileName, setFileName] = useState<string>('');
  const [questions, setQuestions] = useState<ExistingQuestion[]>([]);
  const [answers, setAnswers] = useState<ChunkUpsertAnswer[]>([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (props.questionnairId === 0) return;

    (async () => {
      const response: QuestionResponse = await fetchQuestions(
        props.questionnairId,
        false
      );
      setQuestions(completelyExpandQuestionResponse(response));
    })();
  }, [props.questionnairId]);

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file === undefined) return;

    const reader = new FileReader();
    if (file.name.length <= 4 || file.name.slice(-4) !== '.csv') {
      props.setErrorMessage('CSVファイルを指定してください。');
      return;
    }
    setFileName(file.name);

    reader.readAsText(file, 'UTF-8');
    reader.onload = async () => {
      props.setErrorMessage('');
      props.setMessage('');
      const csvContents: string[] = (reader.result as string).split('\r\n');
      try {
        const csvHeaders: HeaderForFormat[] = createHeadersForFormat(
          csvContents[0],
          questions
        );
        const csvBody: string[][] = csvContents
          .map(parseCSV)
          .filter(
            (row: string[], index: number) =>
              index !== 0 && row.length === csvHeaders.length + 5
          );
        const csvAnswers: ExistingAnswerFromCSV[] = csvBody
          .filter((row: string[]) => row[0] !== '')
          .map((row: string[]) => {
            const answers: Answer[] = row
              .slice(1, -4)
              .reduce(formatAnswer(csvHeaders, questions), []);

            return { metadataId: Number(row[0]), answers };
          });

        const newAnswers: Answer[][] = csvBody
          .filter((row: string[]) => row[0] === '')
          .map((row: string[]) =>
            row.slice(1, -4).reduce(formatAnswer(csvHeaders, questions), [])
          );

        const metadataIds: number[] = csvAnswers.map(
          (csvAnswer) => csvAnswer.metadataId
        );
        const existingAnswers: ValidatingAnswer[] =
          await fetchAnswersByMetadataIds(metadataIds);

        if (
          existingAnswers.some(
            (existingAnswer: ValidatingAnswer) =>
              existingAnswer.questionnairId !== props.questionnairId
          )
        )
          throw new Error(
            '異なるアンケートのIDが指定されている行が存在します。'
          );

        const formedAnswers: ChunkUpsertAnswer[] = formAnswers(
          csvAnswers,
          newAnswers,
          existingAnswers,
          questions
        );

        setAnswers(formedAnswers);
      } catch (e) {
        props.setErrorMessage((e as Error).message);
        setFileName('');
      }
    };
  };

  const fileUpload = () => {
    (inputRef.current! as HTMLElement).click();
  };

  const upsertAnswers = async () => {
    const user = await Auth.currentAuthenticatedUser();

    const request: ChunkUpsertAnswerRequest = {
      answers,
      userId: user.username,
      questionnairId: props.questionnairId
    };

    await chunkUpsertAnswers(request);
    props.setMessage('成功: 正常にCSVのデータをアップロードできました。');
    setAnswers([]);
  };

  return (
    <Stack spacing={2} direction="row" sx={{ marginTop: '1em' }}>
      <Button
        variant="contained"
        onClick={fileUpload}
        disabled={!props.canSelectFile}
      >
        ファイルを選択
      </Button>
      <input
        hidden
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={onFileInputChange}
      />
      <TextField
        value={fileName}
        InputProps={{
          readOnly: true
        }}
        sx={{ minWidth: 500 }}
      />
      <Button
        variant="contained"
        disabled={answers.length === 0}
        onClick={upsertAnswers}
      >
        アップロード
      </Button>
    </Stack>
  );
};

export default FileImportButtons;
