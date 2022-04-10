import classnames from 'classnames';
import React, {useContext, useEffect, useState} from 'react';
import styles from './App.module.scss';
import {IndexCard} from "./components/IndexCard/IndexCard";
import {IndexCardSide, Variants} from "./components/IndexCard/IndexCardSide/IndexCardSide";
import {PractiseContext, PractiseStates, withPractiseContext, Word} from "./context/PractiseContext";
import {Button} from "./components/Button/Button";
import {
    addToStorage, getFlagEmoji,
    getFromStorage, getRandomWithOneExclusion, removeFromArchive,
    removeFromTrainingSet,
    updateArchiveInStorage,
    updateLearnedWordsInStorage
} from "./scripts/util";
import {languages} from "./constants/languages";
import {Link} from "./components/Link/Link";
import Modal from "react-modal";
import {Radio} from "./components/Radio/Radio";

/*Todo:
- style emoji in index card
- mehrere Übersetzungen?
- wort in beispielsatz markieren
- wörter aus dem Archiv löschen
- Nutzer initial sprache einstellen lassen
- Zeichenanzahl beschränken
- Template für Overlay?
- code refactoren
- Webstore sources
 */

export const AppContainer = () => {
    const { state, setState, word, setWord } = useContext(PractiseContext);
    const [ trainingSet, setTrainingSet ] = useState<Word[]>([]);
    const [ archive, setArchive ] = useState<Word[]>([]);
    const [ index, setIndex ] = useState<number>();
    const [ language, setLanguage ] = useState<string>();
    const [ isArchive, setIsArchive ] = useState(false);
    const [ input, setInput ] = useState('');
    const [ flipped, setFlipped ] = useState(false);
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const openModal = (): void => {
        setIsOpen(true);
    };

    const closeModal = (): void => {
        setIsOpen(false);
    };

    useEffect(()=>{
        (async () => {
            updateLanguage();
            updateArchive();
            updateTrainingSet();
        })()
    },[])

    const updateLearnedWords = () => {
        updateLearnedWordsInStorage(1);
    }

    const updateActiveWord = () => {
        if (trainingSet.length > 0) {
            const newIndex = getRandomWithOneExclusion(trainingSet.length, trainingSet.length > 1 ? index : undefined);
            setIndex(newIndex);
            setInput('');
            setWord(trainingSet[newIndex]);
            setState(PractiseStates.INITIAL);
        } else {
            setWord(undefined);
        }
    }

    const switchToNextWord = async () => {
        if (isArchive) {
            updateActiveWord()
        } else {
            updateTrainingSet();
        }
    }

    const updateTrainingSet = async (): Promise<Word[]> => {
        return new Promise((resolve)=>{
            getFromStorage(['trainingSet'],(result) => {
                setTrainingSet(result.trainingSet);
                resolve(result.trainingSet);
            });
        })
    };

    const updateLanguage = () => {
        getFromStorage(['language'],(result) => {
            setLanguage(result.language);
            if(!result.language) {
                openModal();
            }
        });
    };

    const updateArchive = () => {
        getFromStorage(['archive'],(result) => {
            setArchive(result.archive);
        });
    };

    useEffect(() => {
        if (trainingSet && index) {
            setWord(trainingSet[index]);
        }
    }, [index]);

    useEffect(() => {
        if(isArchive) {
            setTrainingSet(archive);
        } else {
            (async () => {
                const set = await updateTrainingSet();
                setTrainingSet(set);
            })();
        }
    }, [isArchive]);

    useEffect(()=> {
        updateActiveWord();
    }, [trainingSet])

    useEffect(() => {
        setFlipped(state !== PractiseStates.INITIAL);
        if (state === PractiseStates.CORRECT && word) {
            updateLearnedWords();
            updateArchiveInStorage(word, updateArchive);
            removeFromTrainingSet(word);
        }
    }, [state]);

    const renderInput = () =>
        <form className={styles.inputContainer} onSubmit={()=>{
            setState(PractiseStates.TO_VERIFY);
            setState(input.trim().toLowerCase() === word?.translation.toLowerCase() ? PractiseStates.CORRECT : PractiseStates.WRONG);
        }}>
            <input className={styles.input} placeholder={`Translation (${word && getFlagEmoji(word.language)}) 🖊️`} value={input} onInput={e => setInput((e.target as HTMLInputElement).value)}/>
            <Button className={styles.button} type="submit">➡</Button>
        </form>;

    const renderCard = () => {
        switch (state) {
            case PractiseStates.INITIAL:
                return renderInput();
            case PractiseStates.WRONG:
                return <>
                    <div className={styles.wrong}>{input}</div>
                    <div className={styles.emoji}>😔</div>
                    <div className={styles.comment}>The word stays in the training set and will be presented later again.</div>
                </>;
            case PractiseStates.CORRECT:
                return <>
                    <div className={styles.correct}>{input}</div>
                    <div className={styles.emoji}>🥳</div>
                    <div className={styles.comment}> Yey! The word is added to the archive.</div>
                </>;
            case PractiseStates.TO_VERIFY:
                return renderInput();
        }
    }



  return (
      <div className={styles.appContainer}>
          { language &&
              <>
              <h1>Practise the words you learned while browsing</h1>
              <div className={styles.column}>
                    <h2>Learned words: {archive.length}</h2>
                  { archive.length > 0 &&
                      <Link onClick={()=>setIsArchive(!isArchive)}>
                          {isArchive ? 'Leave archive' : 'Practise archive'}
                      </Link>
                  }
              </div>
              Words in trainingset: {trainingSet.length}
              { trainingSet.length > 0 && word ?
                  <>
                      <div className={styles.cardContainer}>
                          <IndexCard flipped={flipped}>
                              <IndexCardSide variant={Variants.FRONT} className={styles.wordCard}>
                                  <div className={styles.language}>{getFlagEmoji('en')}</div>
                                  <div>{word?.word}</div>
                                  <div className={styles.text}>{word?.sentence}</div>
                                  <div className={styles.reference}>Learned at <a href={word?.occurance}>{word?.occurance.substring(0,50)}{word?.occurance.length > 51 && '...'}</a></div>
                                  {state !== PractiseStates.INITIAL && <button className={styles.flipButton} onClick={()=>setFlipped(!flipped)} title="Flip">↩</button>}
                              </IndexCardSide>
                              <IndexCardSide variant={Variants.BACK} className={styles.wordCard}>
                                  <div className={styles.language}>{word && getFlagEmoji(word.language)}</div>
                                  <div className={classnames(state === PractiseStates.WRONG && styles.wrong, state === PractiseStates.CORRECT && styles.correct)}>{word?.translation}</div>
                                  <div className={styles.text}>{word?.sentenceTranslation}</div>
                                  <div className={styles.reference}>Learned at <a href={word?.occurance}>{word?.occurance}</a></div>
                                  <button className={styles.flipButton} onClick={()=>setFlipped(!flipped) } title="Flip">↩</button>
                              </IndexCardSide>
                          </IndexCard>
                          <IndexCard>
                              <IndexCardSide variant={Variants.FRONT}>
                                  {renderCard()}
                              </IndexCardSide>
                          </IndexCard>
                      </div>
                      <div className={styles.buttonContainer}>
                          <button className={styles.removeButton} onClick={()=>{
                              (async () => {
                                  if(isArchive) {
                                      await removeFromArchive(word);
                                      updateArchive();
                                  } else {
                                      await removeFromTrainingSet(word);
                                      await updateTrainingSet();
                                  }
                              })();
                          }} title="Remove word">🗑</button>
                          <Button onClick={switchToNextWord}>Next word</Button>
                      </div>
                  </>
                  :
                  <div className={styles.column}>
                      <IndexCard>
                          <IndexCardSide variant={Variants.FRONT}>
                              <div>No words in training set</div>
                          </IndexCardSide>
                      </IndexCard>
                      <div className={classnames(styles.column, styles.infoBox)}>
                          <div>To add words to your training set, select an english word while browsing with</div>
                          <h1 className={styles.row}>
                              <img src="./images/icons/ctrl.png"/> + <div className={classnames(styles.row, styles.noGap)}>2x<img src="./images/icons/click.png"/></div>
                          </h1>
                          <div>
                              (Ctrl + Double Click)
                          </div>
                          <div>see the translation and click the button "Add to training set".</div>
                      </div>
                  </div>
              }
                  <div className={classnames(styles.row, styles.bottomRow)}>
                      <span>Native Language: {getFlagEmoji(language)}</span>
                      <Link onClick={()=>openModal()}>Change</Link>
                  </div>
              </>
            }
          <Modal
              appElement={document.getElementById("root") as HTMLElement}
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              className={styles.modal}
              overlayClassName={styles.modalOverlay}
              contentLabel="Select language"
          >
              <form className={styles.languageForm} onSubmit={(e: any)=>{
                  e.preventDefault();
                  addToStorage({language: e.target.language.value});
                  updateLanguage();
                  closeModal();
              }}>
                  <h3>What's your native language?</h3>
                  <div className={classnames(styles.column, styles.start)}>
                      {languages.map((lang) => (
                              <Radio name="language" value={lang.code} label={lang.name}/>
                          ))}
                  </div>
                  <Button type="submit">Save</Button>
              </form>
          </Modal>
      </div>
  );
}

export const App = withPractiseContext(AppContainer);
