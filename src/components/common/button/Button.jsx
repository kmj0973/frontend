import styles from './Button.module.scss';

const Button = ({
  children,
  type = 'button',
  variant = 'light',
  disabled = false,
  onClick,
}) => {
  const className = [
    styles.button,
    styles[`button--${variant}`],
    disabled ? styles['button--disabled'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
