import React, { useContext } from "react";
import styles from "./App.module.scss";
import {
  PractiseContext,
  withPractiseContext,
} from "./context/PractiseContext";
import { Intro } from "./components/Intro/Intro";
import { CardsArea } from "./components/CardsArea/CardsArea";
import { ButtonsArea } from "./components/ButtonsArea/ButtonsArea";
import { EmptyTrainingsetArea } from "./components/EmptyTrainingSetArea/EmptyTrainingsetArea";
import { Outro } from "./components/Outro/Outro";
import { LanguageModal } from "./components/LanguageModal/LanguageModal";

export const AppContainer = () => {
  const { word, trainingSet, language } = useContext(PractiseContext);

  return (
    <div className={styles.appContainer}>
      {language && (
        <>
          <Intro />
          {trainingSet?.length > 0 && word ? (
            <>
              <CardsArea />
              <ButtonsArea />
            </>
          ) : (
            <EmptyTrainingsetArea />
          )}
          <Outro />
        </>
      )}
      <LanguageModal />
    </div>
  );
};

export const App = withPractiseContext(AppContainer);
