import {requestTranslation, updateTrainingSetInStorage} from "./util";

const sentenceCloser = new RegExp('[!?.]')

const firstIndex = (str: string, regex: RegExp): number => {
    const match = str.match(regex);
    return match ? str.indexOf(match[0]) : -1;
}

const lastIndex = (str: string, regex: RegExp): number => {
    const match = str.match(regex);
    return match ? str.lastIndexOf(match[match.length-1]) : -1;
}


document.addEventListener('dblclick', ()=> {
        const selection = window.getSelection();
        const word = selection?.toString().split(' ')[0];
        const range = selection?.getRangeAt(0);
        const boundingRect = range?.getBoundingClientRect();

        const startContainer = range?.startContainer as Text;

        const textBefore = startContainer.wholeText.substring(0, range?.startOffset);
        const sentenceBefore = textBefore.substring(lastIndex(textBefore, sentenceCloser)+1).trim();

        const textAfter = startContainer.wholeText.substring(range?.endOffset || 0);
        const firstSentenceCloser = firstIndex(textAfter, sentenceCloser);
        const sentenceAfter = textAfter.substring(0, firstSentenceCloser !== -1 ? firstSentenceCloser+1 : undefined).trim();
        const sentence = [sentenceBefore, word, sentenceAfter].join(' ');


        if (word && word.length < 50 && boundingRect) {
            requestTranslation(word, (response) => {
                const translations = response?.translations.map((translation: any) => translation.text).join(", ");
                showTooltip(translations, boundingRect, translations, sentence, word);
            });
        } else {
            console.log('Error with selection');
        }
    }
);

const showTooltip = (message: string, boundingRect: DOMRect, translations: string, sentence: string, word: string) => {
    const id = 'vocabulary-boost-overlay';
    document.getElementById(id)?.remove();

    const tooltip = document.createElement('div');
    tooltip.setAttribute('id', id);
    tooltip.setAttribute('style', `
        position: absolute; 
        top: ${boundingRect.top + window.scrollY}px; 
        left: ${boundingRect.left}px; 
        background: white; 
        transform: translate(0, -100%); 
        padding: 1rem;
        font-size: 1rem;
        z-index: 1000;
        color: #333;`)
    tooltip.innerHTML = `<div>${message}
        <button id="add-vocabulary-boost">+</button>
</div>`;
    document.body.appendChild(tooltip);
    document.getElementById("add-vocabulary-boost")?.addEventListener("click", function(){
        requestTranslation(sentence, (response)=> {
            updateTrainingSetInStorage({
                occurance: window.location.href,
                sentence,
                sentenceTranslation: response?.translations[0].text || "",
                translation: translations,
                word
            })
        })
    });
}

export {};