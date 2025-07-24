import React from 'react';
import styles from './Label.module.css';

// Usamos React.LabelHTMLAttributes para obter todas as props padrão de um <label>
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ className, children, ...props }) => {
  // Combinamos a classe do nosso módulo com qualquer outra classe que possa ser passada via props
  const combinedClassName = `${styles.label} ${className || ''}`;

  return (
    <label className={combinedClassName} {...props}>
      {children}
    </label>
  );
};