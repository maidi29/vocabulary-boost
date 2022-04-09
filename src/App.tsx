import classnames from 'classnames';
import React, {useContext, useEffect, useState} from 'react';
import styles from './App.module.scss';
import {IndexCard} from "./components/IndexCard/IndexCard";
import {IndexCardSide, Variants} from "./components/IndexCard/IndexCardSide/IndexCardSide";
import {PractiseContext, PractiseStates, withPractiseContext} from "./PractiseContext";
import {Button} from "./components/Button/Button";
import {
    addToStorage,
    getFromStorage,
    removeFromTrainingSet,
    updateArchiveInStorage,
    updateLearnedWordsInStorage
} from "./scripts/util";

/*Todo:
- Nutzer im options tab Sprache einstellen lassen
- Zeichenanzahl beschränken
- Wörter die der Nutzer richtig übersetzen kann im Archiv abspeichern, die anderen bleiben im Trainingsset
- immer anzeigen wie viele Wörter schon gelernt wurden
- Wörter aus dem Trainingset in zufälliger Reihenfolge anzeigen
- Anzeigen wie viele Wörter im Trainingset sind.
- Möglichkeit zum Lernen aus dem Archiv geben
- Template für Overlay?
 */


export const AppContainer = () => {
    const { state, setState, word, setWord } = useContext(PractiseContext);
    const [ trainingSet, setTrainingSet ] = useState(
        [
        {
            sentence: "A mouse is in the house.",
            sentenceTranslation: "Im Haus ist eine Maus.",
            translation: "Maus",
            word: "Mouse",
            occurance: "https://skjdfnskjdfijreiurjtieurjtierjeore.sldkfeporkeporn"
        },{
            sentence: "A dog is in the house.",
            sentenceTranslation: "Im Haus ist ein Hund.",
            translation: "Hund",
            word: "Dog",
            occurance: "https://skjdfnskjdfn"
        }
    ]
    );
    const [ index, setIndex ] = useState(0);
    const [ counter, setCounter ] = useState(0);
    const [ language, setLanguage ] = useState(0);
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
    },[])


    setWord(trainingSet[index]);

    const updateLearnedWords = () => {
        setCounter(counter +1);
        updateLearnedWordsInStorage(1);
    }

    const switchToNextWord = () => {
        if (trainingSet.length > 0) {
            const newIndex = getRandomWithOneExclusion(trainingSet.length, index);
            console.log(newIndex);
            setIndex(newIndex);
            setInput('');
            setState(PractiseStates.INITIAL);
        }
    }

    const updateTrainingSet = () => {
        getFromStorage(['trainingSet'],(result) => {
            setTrainingSet(result.trainingSet);
        });
    };

    const updateLanguage = () => {
        getFromStorage(['language'],(result) => {
            setLanguage(result.language);
        });
    };

    useEffect(() => {
        if (trainingSet) {
            setWord(trainingSet[index]);
        }
    }, [index]);

    useEffect(() => {
            setFlipped(state !== PractiseStates.INITIAL);
            if(state === PractiseStates.CORRECT) {
                updateLearnedWords();
                updateArchiveInStorage(word);
                removeFromTrainingSet(word);
                updateTrainingSet();
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

  return (
      <div className={styles.appContainer}>
          {language &&
              <>
              <h1>Practise the words you learned while browsing</h1>
              <h2>Total number of learned words: {counter}</h2>
              Language: {language}
              { trainingSet.length > 0 ?
                  <>
                      <div className={styles.cardContainer}>
                          <IndexCard flipped={flipped}>
                              <IndexCardSide variant={Variants.FRONT}>
                                  <div>{word?.word}</div>
                                  <div className={styles.text}>{word?.sentence}</div>
                                  <div className={styles.reference}>Learned at <a href={word?.occurance}>{word?.occurance.substring(0,50)}{word?.occurance.length > 51 && '...'}</a></div>
                                  {state !== PractiseStates.INITIAL && <button className={styles.flipButton} onClick={()=>setFlipped(!flipped)} title="Flip">↩</button>}
                              </IndexCardSide>
                              <IndexCardSide variant={Variants.BACK}>
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
                              removeFromTrainingSet(word);
                              updateTrainingSet();
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
                      <option value="de">Deutsch</option>
                      <option value="es">Español</option>
                      <option value="ja">日本語</option>
                      <option value="fr">Français</option>
                      <option value="it">Italiano</option>
                      <option value="nl">Nederlands</option>
                      <option value="pl">Polski</option>
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="pt-PT">Português</option>
                      <option value="ru">Русский</option>
                      <option value="zh">简体中文</option>
                  </select>
              </div>
      </div>
  );
}

export const App = withPractiseContext(AppContainer);
