import { MouseEventHandler } from 'react';
import { SxProps } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type AccordionProps = {
  headline: string;
  content: JSX.Element | JSX.Element[];
  headlineSx?: SxProps;
  sx?: SxProps;
  isOpen?: boolean;
  onChange?: (
    event: React.SyntheticEvent<Element, Event>,
    expanded: boolean
  ) => void;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Accordion: React.FC<AccordionProps> = (props) => {
  const headline: string = props.headline;
  const content: JSX.Element | JSX.Element[] = props.content;

  return (
    <MuiAccordion
      expanded={props.isOpen}
      sx={props.sx}
      onChange={props.onChange}
      onClick={props.onClick}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={props.headlineSx}>{headline}</Typography>
      </AccordionSummary>
      <AccordionDetails>{content}</AccordionDetails>
    </MuiAccordion>
  );
};

export default Accordion;
