import React, { useContext, useEffect, useState } from "react";
import {
  PractiseContext,
  PractiseStates,
} from "../../../context/PractiseContext";
import {
  IndexCardSide,
  Variants,
} from "../../IndexCard/IndexCardSide/IndexCardSide";
import { IndexCard } from "../../IndexCard/IndexCard";
import { getFlagEmoji } from "../../../scripts/util";
import { Button } from "../../Button/Button";
import styles from "./TranslationCard.module.scss";

export const TranslationCard = (): JSX.Element => {
  const { state, setState, word, isArchive } = useContext(PractiseContext);
  const [input, setInput] = useState("");

  useEffect(() => {
    setInput("");
  }, [word]);

  const renderInput = () => (
    <form
      className={styles.inputContainer}
      onSubmit={() => {
        setState(PractiseStates.TO_VERIFY);
        setState(
          input.trim().toLowerCase() === word?.translation.toLowerCase()
            ? PractiseStates.CORRECT
            : PractiseStates.WRONG
        );
      }}
    >
      <input
        className={styles.input}
        placeholder={`Translation (${word && getFlagEmoji(word.language)}) 🖊️`}
        value={input}
        onInput={(e) => setInput((e.target as HTMLInputElement).value)}
      />
      <Button className={styles.button} type="submit">
        ➡
      </Button>
    </form>
  );

  const renderResult = () => {
    const isWrong = state === PractiseStates.WRONG;
    return (
      <>
        <div className={isWrong ? styles.wrong : styles.correct}>{input}</div>
        <div className={styles.emoji}>{isWrong ? "😔" : "🥳"}</div>
        <div className={styles.comment}>
          {!isArchive && (
            <>
              {isWrong
                ? "The word stays in the training set and will be presented later again."
                : "Yey! The word is added to the archive."}
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <IndexCard>
      <IndexCardSide
        variant={Variants.FRONT}
        className={styles.translationCard}
      >
        {state === PractiseStates.INITIAL || state === PractiseStates.TO_VERIFY
          ? renderInput()
          : renderResult()}
      </IndexCardSide>
    </IndexCard>
  );
};
