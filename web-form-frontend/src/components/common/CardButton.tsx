import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';

type CardButtonProps = {
  headline: string;
  description: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const CardButton: React.FC<CardButtonProps> = (props) => {
  const { headline, description, onClick } = props;

  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {headline}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardButton;
