document.addEventListener('mouseup', ()=> {
        const selection = window.getSelection();
        const word = selection?.toString().split(' ')[0]
        const position =  selection?.getRangeAt(0)?.getBoundingClientRect();
        if (word && word.length < 50 && position) {
            requestTranslation(word, position);
        } else {
            console.log('Error with selection');
        }
    }
);

const requestTranslation = (word: string, position: DOMRect) => {
    chrome.runtime.sendMessage({word: word}, (response) => {
        const translations = response?.translations.map((translation: any) => translation.text).join(", ");
        showTooltip(translations, response.translations[0].detected_source_language, position);
    })
}

const showTooltip = (message: string, detectedSourceLang: string, position: DOMRect) => {
    const id = 'vocabulary-boost-overlay';
    document.getElementById(id)?.remove();

    const tooltip = document.createElement('div');
    tooltip.setAttribute('id', id);
    tooltip.setAttribute('style', `
        position: absolute; 
        top: ${position.top + window.scrollY}px; 
        left: ${position.left}px; 
        background: white; 
        transform: translate(0, -100%); 
        padding: 1rem;
        font-size: 1rem;
        color: #333;`)
    tooltip.innerHTML = `
        <div>${message}</div>
        <div>Übersetzt aus: ${detectedSourceLang}</div>
    `;

    document.body.appendChild(tooltip);
}

export {};