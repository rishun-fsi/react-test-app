import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

type ButtonWithToolTipProps = {
  title: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: JSX.Element;
  disabled?: boolean;
  className?: string;
};

const ButtonWithToolTip: React.FC<ButtonWithToolTipProps> = (props) => {
  const title: string = props.title;
  const onClick: React.MouseEventHandler<HTMLButtonElement> = props.onClick;
  const icon: JSX.Element = props.icon;
  const disabled: boolean =
    props.disabled !== undefined ? props.disabled : false;

  return disabled ? (
    <IconButton disabled>{icon}</IconButton>
  ) : (
    <Tooltip title={title}>
      <IconButton onClick={onClick} className={props.className}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default ButtonWithToolTip;
