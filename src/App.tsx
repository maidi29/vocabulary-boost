import React, {useContext, useEffect, useState} from 'react';
import './App.scss';
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
        console.log('state: ' , state);
    }, [state]);

    const renderInput = () =>
        <><input placeholder="Translation" value={input} onInput={e => setInput((e.target as HTMLInputElement).value)}/>
            <button onClick={()=>{
                setState(PractiseStates.TO_VERIFY);
                setState(input.trim().toLowerCase() === word.translation.toLowerCase() ? PractiseStates.CORRECT : PractiseStates.WRONG);
            }}>Verify!</button></>;

    const renderCard = () => {
        switch (state) {
            case PractiseStates.INITIAL:
                return renderInput();
            case PractiseStates.WRONG:
                return <>
                    <div className={'wrong'}>{input}</div>
                    <div>The word stays in the training set and will be presented later again.</div>
                </>;
            case PractiseStates.CORRECT:
                return <>
                    <div className={'correct'}>{input}</div>
                    <div>🥳 Yey! The word is added to the archive.</div>
                </>;
            case PractiseStates.TO_VERIFY:
                return renderInput();
        }
    }

  return (
      <div className="app-container">
          <h1>Practise the words you learned while browsing</h1>
          <h2>Total number of learned words: {counter}</h2>
          <div className="card-container">
                <IndexCard flipped={state !== PractiseStates.INITIAL}>
                    <IndexCardSide variant={Variants.FRONT}>
                        <div>{word.word}</div>
                        <div>{word.sentence}</div>
                        <div>Learned at <a href={word.occurance}>{word.occurance}</a></div>
                    </IndexCardSide>
                    <IndexCardSide variant={Variants.BACK}>
                        <div>{word.translation}</div>
                        <div>{word.sentenceTranslation}</div>
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
