import React, { ReactNode } from "react";
import styles from "./IndexCardSide.module.scss";
import classnames from "classnames";

export enum Variants {
  FRONT = "front",
  BACK = "back",
}

export interface IndexCardSideProps {
  children: ReactNode;
  variant: Variants;
  className?: string;
}

export const IndexCardSide = ({
  children,
  variant,
  className,
}: IndexCardSideProps): JSX.Element => {
  return (
    <div className={classnames(styles.content, styles[variant], className)}>
      {children}
    </div>
  );
};
