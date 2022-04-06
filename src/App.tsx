import classnames from 'classnames';
import React, {useContext, useEffect, useState} from 'react';
import styles from './App.module.scss';
import {IndexCard} from "./components/IndexCard/IndexCard";
import {IndexCardSide, Variants} from "./components/IndexCard/IndexCardSide/IndexCardSide";
import {PractiseContext, PractiseStates, withPractiseContext} from "./PractiseContext";

export const AppContainer = () => {
    const { state, setState, word, setWord } = useContext(PractiseContext);
    const [ trainingSet, setTrainingSet ] = useState([
        {
            sentence: "A mouse is in the house.",
            sentenceTranslation: "Im Haus ist eine Maus.",
            translation: "Maus",
            word: "Mouse",
            occurance: "https://skjdfnskjdfn"
        },{
            sentence: "A dog is in the house.",
            sentenceTranslation: "Im Haus ist ein Hund.",
            translation: "Hund",
            word: "Dog",
            occurance: "https://skjdfnskjdfn"
        }
    ]);
    const [ index, setIndex ] = useState(0);
    const [ counter, setCounter ] = useState(0);
    const [input, setInput] = useState('');
    const [flipped, setFlipped] = useState(false);


    chrome.storage?.sync?.get(['trainingSet'], (result) => {
        setTrainingSet(result.trainingSet);
        setWord(result.trainingSet[index]);
        console.log(result);
    });

    setWord(trainingSet[index]);



    /*Todo:
    - Nutzer im options tab Sprache einstellen lassen
    - Zeichenanzahl beschränken
    - Buttons: add to TrainingSet + Dismiss
    - BeispielSatz übersetzen lassen
    - Wörter die der Nutzer richtig übersetzen kann im Archiv abspeichern, die anderen bleiben im Trainingsset
    - immer anzeigen wie viele Wörter schon gelernt wurden
    - Wörter aus dem Trainingset in zufälliger Reihenfolge anzeigen
    - Anzeigen wie viele Wörter im Trainingset sind.
    - Möglichkeit zum Lernen aus dem Archiv geben
    - Template für Overlay?
     */

    const switchToNextWord = () => {
        console.log('switch', index);
        const newIndex = index + 1;
        if (newIndex < trainingSet.length) {
            setIndex(newIndex);
            setInput('');
            setState(PractiseStates.INITIAL);
        } else {
            console.log('no more words');
        }

    }

    useEffect(() => {
        if (trainingSet) {
            setWord(trainingSet[index]);
        }
    }, [index]);

    useEffect(() => {
            setFlipped(state !== PractiseStates.INITIAL);
    }, [state]);

    const renderInput = () =>
        <form className={styles.inputContainer} onSubmit={()=>{
            setState(PractiseStates.TO_VERIFY);
            setState(input.trim().toLowerCase() === word.translation.toLowerCase() ? PractiseStates.CORRECT : PractiseStates.WRONG);
        }}>
            <input className={styles.input} placeholder="Translation" value={input} onInput={e => setInput((e.target as HTMLInputElement).value)}/>
            <button className={styles.button} type="submit">{'>'}</button>
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
          <h1>Practise the words you learned while browsing</h1>
          <h2>Total number of learned words: {counter}</h2>
          <div className={styles.cardContainer}>
                <IndexCard flipped={flipped}>
                    <IndexCardSide variant={Variants.FRONT}>
                        <div>{word.word}</div>
                        <div className={styles.text}>{word.sentence}</div>
                        <div className={styles.reference}>Learned at <a href={word.occurance}>{word.occurance}</a></div>
                        {state !== PractiseStates.INITIAL && <button onClick={()=>setFlipped(!flipped)}>Flip</button>}
                    </IndexCardSide>
                    <IndexCardSide variant={Variants.BACK}>
                        <div className={classnames(state === PractiseStates.WRONG && styles.wrong, state === PractiseStates.CORRECT && styles.correct)}>{word.translation}</div>
                        <div className={styles.text}>{word.sentenceTranslation}</div>
                        <div className={styles.reference}>Learned at <a href={word.occurance}>{word.occurance}</a></div>
                        <button onClick={()=>setFlipped(!flipped)}>Flip</button>
                    </IndexCardSide>
                </IndexCard>
                <IndexCard>
                    <IndexCardSide variant={Variants.FRONT}>
                        {renderCard()}
                    </IndexCardSide>
                </IndexCard>
          </div>
          <button onClick={switchToNextWord}>Next word</button>
    </div>

  );
}

export const App = withPractiseContext(AppContainer);
