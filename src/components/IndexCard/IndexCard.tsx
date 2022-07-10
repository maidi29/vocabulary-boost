import React, { ReactElement, useEffect, useState } from "react";
import styles from "./IndexCard.module.scss";
import { IndexCardSideProps } from "./IndexCardSide/IndexCardSide";

type side = ReactElement<IndexCardSideProps>;

interface IndexCardProps {
  children: [side, side] | side;
  flipped?: boolean;
}

export const IndexCard = ({
  children,
  flipped = false,
}: IndexCardProps): JSX.Element => {
  return (
    <div className={styles.card}>
      <div className={`${styles.content} ${flipped && styles.flip}`}>
        {children}
      </div>
    </div>
  );
};
