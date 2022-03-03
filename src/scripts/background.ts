chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.create({url:
            chrome.runtime.getURL('index.html')
    });
});

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    fetchTranslation(request.word).then(sendResponse);
    return true;
});

const fetchTranslation = async (word: string) => {
    let url = new URL('https://api-free.deepl.com/v2/translate');
    const params = {
        auth_key: '96dfdf8c-64a8-66e3-799c-d66a731ebfef:fx',
        text: word,
        target_lang: 'DE',
        source_lang: 'EN'
    }
    url.search = new URLSearchParams(params).toString();
    const fetchUrl = url.toString();

    const translation = await fetch(fetchUrl, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(error => console.log("error", error));

    console.log('translation :', JSON.stringify(translation));
    return translation;
}

export {};
