import classnames from 'classnames';
import React, {useContext, useEffect, useState} from 'react';
import styles from './App.module.scss';
import {IndexCard} from "./components/IndexCard/IndexCard";
import {IndexCardSide, Variants} from "./components/IndexCard/IndexCardSide/IndexCardSide";
import {PractiseContext, PractiseStates, withPractiseContext} from "./context/PractiseContext";
import {Button} from "./components/Button/Button";
import {
    addToStorage, getFlagEmoji,
    getFromStorage,
    removeFromTrainingSet,
    updateArchiveInStorage,
    updateLearnedWordsInStorage
} from "./scripts/util";
import {languages} from "./constants/languages";
import {Languages} from "./model/Languages";

/*Todo:
- wörter aus dem Archiv löschen
- Nutzer initial sprache einstellen lassen
- Zeichenanzahl beschränken
- immer anzeigen wie viele Wörter schon gelernt wurden
- Anzeigen wie viele Wörter im Trainingset sind.
- Template für Overlay?
 */

export const AppContainer = () => {
    const { state, setState, word, setWord } = useContext(PractiseContext);
    const [ trainingSet, setTrainingSet ] = useState([]);
    const [ index, setIndex ] = useState(0);
    const [ counter, setCounter ] = useState(0);
    const [ language, setLanguage ] = useState<string>();
    const [ archive, setArchive ] = useState([]);
    const [ isArchive, setIsArchive ] = useState(false);
    const [input, setInput] = useState('');
    const [flipped, setFlipped] = useState(false);

    const getRandomWithOneExclusion = (lengthOfArray: number,indexToExclude?: number) =>{
        let rand = null;
        while(rand === null || rand === indexToExclude){
            rand = Math.round(Math.random() * (lengthOfArray - 1));
        }
        return rand;
    }

    useEffect(()=>{
        getFromStorage(['trainingSet'],(result) => {
            const newIndex = getRandomWithOneExclusion(trainingSet.length);
            console.log(newIndex);
            setIndex(newIndex);
            setTrainingSet(result.trainingSet);
            setWord(result.trainingSet[index]);
        });
        getFromStorage(['counter'],(result) => {
            setCounter(result.counter);
        });
        updateLanguage();
        updateArchive();
    },[])

    setWord(trainingSet[index]);

    const updateLearnedWords = () => {
        setCounter(counter +1);
        updateLearnedWordsInStorage(1);
    }

    const switchToNextWord = async () => {
        if(!isArchive) {
            await updateTrainingSet();
        }
        if (trainingSet.length > 0) {
            const newIndex = getRandomWithOneExclusion(trainingSet.length, index);
            setIndex(newIndex);
            setInput('');
            setState(PractiseStates.INITIAL);
        } else {
            alert("last word");
        }
    }

    const updateTrainingSet = async (): Promise<void> => {
        return new Promise((resolve)=>{
            getFromStorage(['trainingSet'],(result) => {
                setTrainingSet(result.trainingSet);
                console.log('resolve');
                resolve();
            });
        })
    };

    const updateLanguage = () => {
        getFromStorage(['language'],(result) => {
            setLanguage(result.language);
        });
    };

    const updateArchive = () => {
        getFromStorage(['archive'],(result) => {
            setArchive(result.archive);
        });
    };

    useEffect(() => {
        if (trainingSet) {
            setWord(trainingSet[index]);
        }
    }, [index]);

    useEffect(() => {
        setFlipped(state !== PractiseStates.INITIAL);
        if (state === PractiseStates.CORRECT) {
            updateLearnedWords();
            updateArchiveInStorage(word, updateArchive);
            removeFromTrainingSet(word);
        }
    }, [state]);

    const renderInput = () =>
        <form className={styles.inputContainer} onSubmit={()=>{
            setState(PractiseStates.TO_VERIFY);
            setState(input.trim().toLowerCase() === word.translation.toLowerCase() ? PractiseStates.CORRECT : PractiseStates.WRONG);
        }}>
            <input className={styles.input} placeholder="Translation🖊️" value={input} onInput={e => setInput((e.target as HTMLInputElement).value)}/>
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

    useEffect(() => {
        setTrainingSet(isArchive ? archive: trainingSet);
        switchToNextWord();
    }, [isArchive]);

  return (
      <div className={styles.appContainer}>
          { archive.length > 0 &&
              <Button onClick={()=>setIsArchive(!isArchive)}>
                  {isArchive ? 'Leave archive' : 'Practice archive'}
              </Button>
          }
          { language &&
              <>
              <h1>Practise the words you learned while browsing</h1>
              <h2>Total number of learned words: {counter}</h2>
              Language: {language}
              { trainingSet.length > 0 && word ?
                  <>
                      <div className={styles.cardContainer}>
                          <IndexCard flipped={flipped}>
                              <IndexCardSide variant={Variants.FRONT}>
                                  <div>{getFlagEmoji('en')}</div>
                                  <div>{word?.word}</div>
                                  <div className={styles.text}>{word?.sentence}</div>
                                  <div className={styles.reference}>Learned at <a href={word?.occurance}>{word?.occurance.substring(0,50)}{word?.occurance.length > 51 && '...'}</a></div>
                                  {state !== PractiseStates.INITIAL && <button className={styles.flipButton} onClick={()=>setFlipped(!flipped)} title="Flip">↩</button>}
                              </IndexCardSide>
                              <IndexCardSide variant={Variants.BACK}>
                                  <div>{word && getFlagEmoji(word.language)}</div>
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
                                  await removeFromTrainingSet(word);
                                  await updateTrainingSet();
                              })();
                          }} title="Remove word">🗑</button>
                          <Button onClick={switchToNextWord}>Next word</Button>
                      </div>
                  </>
                  :
                  <div>
                      <IndexCard>
                          <IndexCardSide variant={Variants.FRONT}>
                              <div>You have no words in your training set yet</div>
                          </IndexCardSide>
                      </IndexCard>
                      <div>
                          To add words to your training set select an english word while browsing with
                          <div>
                              <img src="./images/icons/ctrl.png"/> + 2<img src="./images/icons/click.png"/>
                          </div>
                          <div>
                              Ctrl + Double Click
                          </div>
                          see the translation and click the button "Add to training set".
                      </div>
                  </div>}
              </>
            }
                  <div>
                      What's your native language?
                      <select aria-labelledby="languageSelectorIcon" value={language} onChange={(e)=>{
                          addToStorage({language: e.target.value});
                          updateLanguage();
                      }}>
                          {languages.map((lang) => (
                                  <option value={lang.code}>{getFlagEmoji(lang.code)}{lang.name}</option>
                              )
                          )}
                  </select>
              </div>
      </div>
  );
}

export const App = withPractiseContext(AppContainer);
