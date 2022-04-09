import {addToStorage, getFromStorage, waitForStorage} from "./util";

chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.create({url:
            chrome.runtime.getURL('index.html')
    });
});

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    fetchTranslation(request.word).then(sendResponse);
    return true;
});

chrome.runtime.onInstalled.addListener(function (object) {
    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    }
});

const fetchTranslation = async (word: string) => {
    let lang = await waitForStorage('language') as string || 'DE';
    let url = new URL('https://api-free.deepl.com/v2/translate');
    const params = {
        auth_key: '96dfdf8c-64a8-66e3-799c-d66a731ebfef:fx',
        text: word,
        target_lang: lang,
        source_lang: 'EN'
    }
    url.search = new URLSearchParams(params).toString();
    const fetchUrl = url.toString();

    return await fetch(fetchUrl, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(error => console.log("error", error));
}

export {};
