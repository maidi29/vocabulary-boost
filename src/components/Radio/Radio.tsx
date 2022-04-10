import React, {ComponentProps, HTMLAttributes} from 'react';
import styles from './Radio.module.scss';
import classnames from "classnames";

interface RadioProps {
    label: string;
}

export const Radio = ({ label, ...props}: ComponentProps<'input'> & RadioProps): JSX.Element => {
    return (
        <label className={styles.radio}>
            <input {...props} type="radio"/>{label}
        </label>
          );
}
