import { useNavigate } from 'react-router-dom';
import CardButton from '../common/CardButton';
import Headline from '../common/Headline';

const FileIOTopPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Headline headline="ファイル入出力メニュー" />
      <CardButton
        headline="回答を一括アップロード"
        description="CSVファイルから回答を一括アップロードします。"
        onClick={() => {
          navigate('/csv-upload');
        }}
      />
    </>
  );
};

export default FileIOTopPage;
