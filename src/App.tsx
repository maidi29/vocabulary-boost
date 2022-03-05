import React, {useContext} from 'react';
import './App.scss';
import {IndexCard} from "./components/IndexCard/IndexCard";
import {IndexCardSide, Variants} from "./components/IndexCard/IndexCardSide/IndexCardSide";
import {PractiseContext, PractiseContextProvider, PractiseStates, withPractiseContext} from "./PractiseContext";

export const AppContainer = () => {
    const { state, setState, word, setWord } = useContext(PractiseContext);

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
        chrome.storage.sync.get(['trainingSet'], (result) => {console.log(result)});
        setWord({
            sentence: "A mouse is in the house.",
            sentenceTranslation: "Im Haus ist eine Maus.",
            translation: "Maus",
            word: "Mouse",
            occurance: "https://skjdfnskjdfn"
        })
    }
  return (
      <div>
        <IndexCard flipped={state !== PractiseStates.INITIAL}>
                <IndexCardSide variant={Variants.FRONT}>
                    <div>{word.word}</div>
                    <div>{word.sentence}</div>
                </IndexCardSide>
                <IndexCardSide variant={Variants.BACK}>
                    <div>{word.translation}</div>
                    <div>{word.sentenceTranslation}</div>
                </IndexCardSide>
        </IndexCard>
        <IndexCard>
            <IndexCardSide variant={Variants.FRONT}>
                <input placeholder="Translation"/>
                <button onClick={()=>setState(PractiseStates.TO_VERIFY)}>Verify!</button>
            </IndexCardSide>
        </IndexCard>
          <button onClick={switchToNextWord}>Next word</button>
    </div>

  );
}

export const App = withPractiseContext(AppContainer);
