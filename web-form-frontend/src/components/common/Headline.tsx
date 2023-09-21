import { Typography } from '@mui/material';

const headlineStyle = {
  marginTop: '0.2em',
  padding: '0.1em',
  backgroundColor: '#1976D2',
  color: '#FFFFFF'
};

type HeadlineProps = {
  headline: string;
};

const Headline: React.FC<HeadlineProps> = (props) => {
  return (
    <Typography sx={headlineStyle} variant="h4" gutterBottom>
      {props.headline}
    </Typography>
  );
};

export default Headline;
