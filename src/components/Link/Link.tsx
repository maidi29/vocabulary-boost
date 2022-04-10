import React, {ComponentProps, HTMLAttributes} from 'react';
import styles from './Link.module.scss';
import classnames from "classnames";

export const Link = ({...props}: ComponentProps<'a'>): JSX.Element => {
    return (
        <a {...props} className={classnames(props.className, styles.link)}>
            <span className={styles.text}>{props.children}</span>
            <span className={classnames(props.className, styles.chevron)}>⪢</span>
        </a>
    );
}
