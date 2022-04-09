import {requestTranslation, updateTrainingSetInStorage, waitForStorage} from "./util";
import {Languages} from "../model/Languages";

const sentenceCloser = new RegExp('[!?.]');
let ctrlKeyPressed = false;

const firstIndex = (str: string, regex: RegExp): number => {
    const match = str.match(regex);
    return match ? str.indexOf(match[0]) : -1;
}

const lastIndex = (str: string, regex: RegExp): number => {
    const match = str.match(regex);
    return match ? str.lastIndexOf(match[match.length-1]) : -1;
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        ctrlKeyPressed = true;
    }
})
document.addEventListener('keyup', (e) => {
    if (e.ctrlKey) {
        ctrlKeyPressed = false;
    }
})


document.addEventListener('dblclick', ()=> {
        if (ctrlKeyPressed) {
            const selection = window.getSelection();
            const word = selection?.toString().split(' ')[0]
                .replace(new RegExp(/[.,;?!()]/g), '');
            const range = selection?.getRangeAt(0);
            const boundingRect = range?.getBoundingClientRect();

            const startContainer = range?.startContainer as Text;

            const textBefore = startContainer?.wholeText?.substring(0, range?.startOffset);
            const sentenceBefore = textBefore?.substring(lastIndex(textBefore, sentenceCloser) + 1).trim();

            const textAfter = startContainer?.wholeText?.substring(range?.endOffset || 0);
            const firstSentenceCloser = firstIndex(textAfter, sentenceCloser);
            const sentenceAfter = textAfter?.substring(0, firstSentenceCloser !== -1 ? firstSentenceCloser + 1 : undefined).trim();
            const sentence = [sentenceBefore, word, sentenceAfter].join(' ');


            if (word && word.length < 50 && boundingRect) {
                requestTranslation(word, (response) => {
                    const translation = response?.translations[0].text;
                    showTooltip(boundingRect, translation, sentence, word);
                });
            } else {
                console.log('Error with selection');
            }
        }
    }
);

const showTooltip = (boundingRect: DOMRect, translation: string, sentence: string, word: string) => {
    const id = 'vocabulary-boost-overlay';
    const closeId = 'vocabulary-boost-close';
    const addId = 'vocabulary-boost-add';
    document.getElementById(id)?.remove();

    const tooltip = document.createElement('div');
    tooltip.setAttribute('id', id);
    tooltip.setAttribute('style', `
        position: absolute; 
        top: ${boundingRect.top + window.scrollY}px; 
        left: ${boundingRect.left}px; 
        background: white; 
        transform: translate(0, -100%); 
        padding: 12px;
        z-index: 1000;
        box-shadow: 2px 2px 5px -1px #333;
        color: #333;
        font-size: 16px;
        font-family: sans-serif;
        display: flex;
        flex-direction: column;
        gap: 5px;
        max-width: 100%;`
    )
    tooltip.innerHTML = `
        <button id="${closeId}" title="close" style="
            align-self: flex-end;
            border: none;
            font-size: 10px;
            cursor: pointer;
            background: none;
        ">❌</button>
        <div>${translation}</div>
        <button id="${addId}" title="add" style="
            background: #7981A4;
            color: white;
            padding: 7px 15px;
            border: none;
            cursor: pointer;
        ">Add to training set</button>`;
    document.body.appendChild(tooltip);
    document.getElementById(addId)?.addEventListener("click", async function () {
        document.getElementById(id)?.remove();
        const lang = await waitForStorage('language') as Languages || Languages.DE;
        requestTranslation(sentence, (response) => {
            updateTrainingSetInStorage({
                occurance: window.location.href,
                sentence,
                sentenceTranslation: response?.translations[0].text || "",
                translation,
                word,
                language: lang
            })
        });
    });
    document.getElementById(closeId)?.addEventListener("click", function(){
        document.getElementById(id)?.remove();
    });
}

export {};