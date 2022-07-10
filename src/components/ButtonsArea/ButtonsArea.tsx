import React, { useContext } from "react";
import styles from "./ButtonsArea.module.scss";
import { PractiseContext } from "../../context/PractiseContext";
import { removeFromTrainingSetInStorage } from "../../scripts/util";
import { Button } from "../Button/Button";

export const ButtonsArea = (): JSX.Element => {
  const { isArchive, word, setTrainingSetFromStorage, switchToNextWord } =
    useContext(PractiseContext);

  return (
    <div className={styles.buttonContainer}>
      {!isArchive && (
        <button
          className={styles.removeButton}
          onClick={() => {
            (async () => {
              if (word) {
                await removeFromTrainingSetInStorage(word);
                await setTrainingSetFromStorage();
              }
            })();
          }}
          title="Remove word"
        >
          🗑
        </button>
      )}
      <Button onClick={switchToNextWord}>Next word</Button>
    </div>
  );
};
