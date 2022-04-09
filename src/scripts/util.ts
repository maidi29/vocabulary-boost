import {Word} from "../context/PractiseContext";


/***storage****/
export const requestTranslation = (word: string, callback: (response: any)=>void) => {
    chrome.runtime?.sendMessage({word: word}, callback)
}

export const addToStorage = (items: { [key: string]: any }) => {
    chrome.storage?.sync?.set(items);
}

export const getFromStorage = (name: string | string[] | { [key: string]: any }, callback: (items: { [key: string]: any }) => void): any => {
    chrome.storage?.sync?.get(name, callback);
}

export const waitForStorage = async (key: string): Promise<string | Record<string, any>> => {
    return new Promise((resolve, reject) => {
        getFromStorage([key], function (result) {
            if (result[key] === undefined) {
                reject();
            } else {
                resolve(result[key]);
            }
        });
    });
};

export const updateTrainingSetInStorage = (word: Word) => {
    getFromStorage({
            trainingSet: []
        },
        (data)=> {
            data.trainingSet.push(word);
            addToStorage({trainingSet: data.trainingSet});
        }
    );
}

export const updateArchiveInStorage = (word: Word, callback: ()=>void) => {
    getFromStorage({
            archive: []
        },
        (data)=> {
            data.archive.push(word);
            addToStorage({archive:data.archive});
            callback();
        }
    );
}

export const removeFromTrainingSet = (word: Word): Promise<void> => {
    return new Promise((resolve) => {
        getFromStorage({
                trainingSet: []
            },
            (data) => {
                const index = data.trainingSet.findIndex((w: Word) => word.word === w.word && word.sentence === word.sentence);
                if (index > -1) {
                    data.trainingSet.splice(index, 1);
                }
                addToStorage({trainingSet: data.trainingSet});
                resolve();
            }
        );
    });
}

export const updateLearnedWordsInStorage = (increaseNumber: number) => {
    getFromStorage({
            learnedWords: 0
        },
        (data)=> {
            data.learnedWords += increaseNumber;
            addToStorage({learnedWords:data.learnedWords});
        }
    );
}


/***other utils***/
export const getFlagEmoji = (countryCode: string): string => {
    return countryCode?.toUpperCase()?.replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}
