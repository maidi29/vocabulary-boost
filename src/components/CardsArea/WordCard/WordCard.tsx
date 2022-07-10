import React, { useContext, useEffect, useState } from "react";
import styles from "./WordCard.module.scss";
import { PractiseContext } from "../../../context/PractiseContext";
import {
  IndexCardSide,
  Variants,
} from "../../IndexCard/IndexCardSide/IndexCardSide";
import { getFlagEmoji } from "../../../scripts/util";
import { PractiseStates } from "../../../context/PractiseContext";
import classnames from "classnames";
import { IndexCard } from "../../IndexCard/IndexCard";

export const WordCard = (): JSX.Element => {
  const { state, word } = useContext(PractiseContext);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(state !== PractiseStates.INITIAL);
  }, [state]);

  const formatSentence = (
    sentence: string,
    wordToHighlight: string
  ): JSX.Element => {
    const startIndexWord = sentence
      .toLowerCase()
      .indexOf(wordToHighlight.toLowerCase());
    const parts = sentence.split(new RegExp(wordToHighlight, "i"));
    const highlightedPart = sentence.substring(
      startIndexWord,
      startIndexWord + wordToHighlight.length
    );
    return (
      <>
        {parts.map((part, index) => (
          <>
            {part}
            {index < parts.length - 1 && highlightedPart !== "" && (
              <b>{highlightedPart}</b>
            )}
          </>
        ))}
      </>
    );
  };

  return (
    <>
      {word && (
        <IndexCard flipped={flipped}>
          <IndexCardSide variant={Variants.FRONT} className={styles.wordCard}>
            <div className={styles.language}>{getFlagEmoji("en")}</div>
            <div>{word?.word}</div>
            <div className={styles.text}>
              {formatSentence(word.sentence, word.word)}
            </div>
            <div className={styles.reference}>
              Learned at{" "}
              <a target="_blank" href={word?.occurance} rel="noreferrer">
                {word?.occurance.substring(0, 50)}
                {word?.occurance.length > 51 && "..."}
              </a>
            </div>
            {state !== PractiseStates.INITIAL && (
              <button
                className={styles.flipButton}
                onClick={() => setFlipped(!flipped)}
                title="Flip"
              >
                ↩
              </button>
            )}
          </IndexCardSide>
          <IndexCardSide variant={Variants.BACK} className={styles.wordCard}>
            <div className={styles.language}>
              {word && getFlagEmoji(word.language)}
            </div>
            <div
              className={classnames(
                state === PractiseStates.WRONG && styles.wrong,
                state === PractiseStates.CORRECT && styles.correct
              )}
            >
              {word?.translation}
            </div>
            <div className={styles.text}>
              {formatSentence(word.sentenceTranslation, word.translation)}
            </div>
            <div className={styles.reference}>
              Learned at{" "}
              <a target="_blank" href={word?.occurance} rel="noreferrer">
                {word?.occurance.substring(0, 50)}
                {word?.occurance.length > 51 && "..."}
              </a>
            </div>
            <button
              className={styles.flipButton}
              onClick={() => setFlipped(!flipped)}
              title="Flip"
            >
              ↩
            </button>
          </IndexCardSide>
        </IndexCard>
      )}
    </>
  );
};
