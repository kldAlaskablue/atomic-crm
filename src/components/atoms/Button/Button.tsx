import React from 'react';
import styles from './Button.module.css';

// Definimos os tipos de variantes que nosso botão pode ter
type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant = 'primary', // 'primary' como padrão
  ...props
}) => {
  // Mapeamos a prop 'variant' para uma classe CSS do nosso módulo
  const variantClass = styles[variant];
  const combinedClassName = `${styles.button} ${variantClass} ${className || ''}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};