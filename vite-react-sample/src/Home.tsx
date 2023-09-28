/** @jsxImportSource @emotion/react */
import Button from '@mui/material/Button';
import { css } from '@emotion/react';


const EmotionButton: React.FC = () => {
  return (
    <div css={css`
    display: flex;
    width: 100vw;    
    height: 100vh;
    justify-content: center;
    align-items: center;
    background: red;
  `}>
    <Button
    css={css`
    width: 100px;
  
  `}
      variant="contained"
    >
      Hello
    </Button>
    </div>
  );
};

export default EmotionButton;