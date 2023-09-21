import { useNavigate } from 'react-router-dom';
import CardButton from '../common/CardButton';
import Headline from '../common/Headline';
import QuestionnairsTable from './QuestionnairsTable';

const FormManagementTopPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Headline headline="フォーム新規作成" />
      <Headline headline="フォームテンプレート" />
      <CardButton
        headline="通常フォーム"
        description="通常の新規フォーム"
        onClick={() => {
          navigate('/form-management/new');
        }}
      />
      <Headline headline="作成済みフォーム" />
      <QuestionnairsTable />
    </>
  );
};

export default FormManagementTopPage;
