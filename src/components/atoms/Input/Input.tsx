import React from 'react';
import styles from './Input.module.css';

// Tipagem para as props do Input
type BaseProps = {
  className?: string;
};

// Tipos para diferenciar as props de 'input' e 'textarea'
type InputAsInput = BaseProps & React.InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };
type InputAsTextarea = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };

export type InputProps = InputAsInput | InputAsTextarea;


export const Input: React.FC<InputProps> = (props) => {
  const { className, ...rest } = props;
  const combinedClassName = `${styles.input} ${className || ''}`;

  // Renderiza uma textarea se a prop 'as' for 'textarea'
  if (props.as === 'textarea') {
    return (
        <textarea 
            className={combinedClassName} 
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} 
        />
    );
  }

  // Caso contrário, renderiza um input padrão
  return (
    <input 
        className={combinedClassName} 
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} 
    />
    );
};