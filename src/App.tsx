import classnames from 'classnames';
import React, {useContext} from 'react';
import styles from './App.module.scss';
import {IndexCard} from "./components/IndexCard/IndexCard";
import {IndexCardSide, Variants} from "./components/IndexCard/IndexCardSide/IndexCardSide";
import {PractiseContext, withPractiseContext} from "./context/PractiseContext";
import {Button} from "./components/Button/Button";
import {
    addToStorage, getFlagEmoji,
} from "./scripts/util";
import {languages} from "./constants/languages";
import {Link} from "./components/Link/Link";
import Modal from "react-modal";
import {Radio} from "./components/Radio/Radio";
import {Intro} from "./components/Intro/Intro";
import {CardsArea} from "./components/CardsArea/CardsArea";
import {ButtonsArea} from "./components/ButtonsArea/ButtonsArea";
import {EmptyTrainingsetArea} from "./components/EmptyTrainingSetArea/EmptyTrainingsetArea";
import {Outro} from "./components/Outro/Outro";
import {LanguageModal} from "./components/LanguageModal/LanguageModal";

export const AppContainer = () => {
    const { word, trainingSet, language, modalIsOpen, setModalIsOpen, updateLanguage } = useContext(PractiseContext);

    const openModal = (): void => {
        setModalIsOpen(true);
    };

    const closeModal = (): void => {
        setModalIsOpen(false);
    };

  return (
      <div className={styles.appContainer}>
          { language &&
              <>
              <Intro/>
              { trainingSet.length > 0 && word ?
                  <>
                      <CardsArea/>
                      <ButtonsArea />
                  </>
                  : <EmptyTrainingsetArea/>
              }
                  <Outro/>
              </>
            }
          <LanguageModal/>

      </div>
  );
}

export const App = withPractiseContext(AppContainer);

/* API Key, background und contentscript refactoren, testen*/