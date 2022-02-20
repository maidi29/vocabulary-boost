import React from 'react';
import './App.scss';

export const App = () => {

    /*Todo:
    - Nutzer im options tab Sprache einstellen lassen
    - Auf Selection (mouseup) reagieren und Tooltip anzeigen: window.getSelection().toString(), selection.getRangeAt(0).getBoundingClientRect();
    - Im Tooltip Übersetzung anzeigen (API Call über Message und dann im background script?? (Zeichenanzahl beschränken?)
    chrome.runtime.sendMessage({type:'request_password'});
    background.js: chrome.runtime.onMessage.addListener(function(request) { if (request.type === 'request_password') {
    - Button zum Hinzufügen des Worts zum Training Set und dann im storage speichern (ggf. ganzen Satz als Beispiel speichern?)
    chrome.storage.sync.set({ "yourBody": "myBody" }, function(){ //  A data saved callback omg so fancy});
    chrome.storage.sync.get(["yourBody"], function(items){//  items = [ { "yourBody": "myBody" } ]});
    - index.html (on Click auf icon) dort Trainingsset aus dem Storage abrufen
    - Wörter die der Nutzer richtig übersetzen kann im Archiv abspeichern, die anderen bleiben im Trainingsset
    - immer anzeigen wie viele Wörter schon gelernt wurden

     */
  return (
    <div>
      Hello
    </div>
  );
}
