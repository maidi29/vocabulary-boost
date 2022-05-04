import React from 'react';
import styles from './CardsArea.module.scss';
import {WordCard} from "./WordCard/WordCard";
import {TranslationCard} from "./TranslationCard/TranslationCard";

export const CardsArea = (): JSX.Element => {
    return (
            <div className={styles.cardContainer}>
                <WordCard/>
                <TranslationCard/>
            </div>
    );
}
