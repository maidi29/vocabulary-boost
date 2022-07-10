import React, {
  ComponentType,
  createContext,
  FC,
  useEffect,
  useState,
} from "react";
import { Languages } from "../model/Languages";
import {
  getFromStorage,
  getRandomWithOneExclusion,
  removeFromTrainingSetInStorage,
  updateArchiveInStorage,
} from "../scripts/util";

export enum PractiseStates {
  INITIAL = 0,
  TO_VERIFY = 1,
  CORRECT = 2,
  WRONG = 3,
}

export interface Word {
  word: string;
  translation: string;
  sentence: string;
  sentenceTranslation: string;
  occurance: string;
  language: Languages;
}

export type PractiseContextType = {
  word?: Word;
  setWord: (word?: Word) => void;
  state: PractiseStates;
  setState: (newState: PractiseStates) => void;
  archive: Word[];
  setArchive: (archive: Word[]) => void;
  isArchive: boolean;
  setIsArchive: (isArchive: boolean) => void;
  trainingSet: Word[];
  setTrainingSet: (archive: Word[]) => void;
  setTrainingSetFromStorage: () => Promise<Word[]>;
  switchToNextWord: () => void;
  language?: string;
  setLanguage: (language: string) => void;
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  updateLanguage: () => void;
};

export const PractiseContext = createContext<PractiseContextType>(undefined!);

export const PractiseContextProvider: FC = ({ children }) => {
  const [word, setWord] = useState<Word>();
  const [state, setState] = useState(PractiseStates.INITIAL);
  const [archive, setArchive] = useState<Word[]>([]);
  const [isArchive, setIsArchive] = useState(false);
  const [language, setLanguage] = useState<string>();
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  const [trainingSet, setTrainingSet] = useState<Word[]>([]);
  const [index, setIndex] = useState<number>();

  const updateActiveWord = () => {
    if (trainingSet && trainingSet.length > 0) {
      const newIndex = getRandomWithOneExclusion(
        trainingSet.length,
        trainingSet.length > 1 ? index : undefined
      );
      setIndex(newIndex);
      setWord(trainingSet[newIndex]);
      setState(PractiseStates.INITIAL);
    } else {
      setWord(undefined);
    }
  };

  const switchToNextWord = () => {
    isArchive ? updateActiveWord() : setTrainingSetFromStorage();
  };

  const setTrainingSetFromStorage = async (): Promise<Word[]> => {
    return new Promise((resolve) => {
      getFromStorage(["trainingSet"], (result) => {
        setTrainingSet(result.trainingSet);
        resolve(result.trainingSet);
      });
    });
  };
  const setLanguageFromStorage = () => {
    getFromStorage(["language"], (result) => {
      setLanguage(result.language);
      if (!result.language) {
        setModalIsOpen(true);
      }
    });
  };

  const setArchiveFromStorage = () => {
    getFromStorage(["archive"], (result) => {
      setArchive(result.archive);
    });
  };

  // on switch to archive set the currently active trainingset
  useEffect(() => {
    isArchive ? setTrainingSet(archive) : setTrainingSetFromStorage();
  }, [isArchive]);

  // on state is correct move word from trainingset to archive
  useEffect(() => {
    if (state === PractiseStates.CORRECT && word && !isArchive) {
      updateArchiveInStorage(word, setArchiveFromStorage);
      removeFromTrainingSetInStorage(word);
    }
  }, [state]);

  // when trainingset changes (archive or not) set an active word
  useEffect(() => {
    updateActiveWord();
  }, [trainingSet]);

  // in the beginning get language, archive and training set from storage
  useEffect(() => {
    (async () => {
      setLanguageFromStorage();
      setArchiveFromStorage();
      setTrainingSetFromStorage();
    })();
  }, []);

  return (
    <PractiseContext.Provider
      value={{
        word,
        setWord,
        state,
        setState,
        archive,
        setArchive,
        isArchive,
        setIsArchive,
        trainingSet,
        setTrainingSet,
        setTrainingSetFromStorage,
        switchToNextWord,
        language,
        setLanguage,
        modalIsOpen,
        setModalIsOpen,
        updateLanguage: setLanguageFromStorage,
      }}
    >
      {children}
    </PractiseContext.Provider>
  );
};

export const withPractiseContext =
  <T extends object>(Component: ComponentType<T>) =>
  ({ ...props }: T): JSX.Element =>
    (
      <PractiseContextProvider>
        <Component {...props} />
      </PractiseContextProvider>
    );
