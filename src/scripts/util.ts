import {Word} from "../PractiseContext";

export const addToStorage = (items: { [key: string]: any }) => {
    chrome.storage.sync.set(items);
}

export const getFromStorage = (name: string | string[] | { [key: string]: any }, callback: (items: { [key: string]: any }) => void): any => {
    chrome.storage?.sync?.get([name], callback);
}

export const updateTrainingSetInStorage = (word: Word) => {
    getFromStorage({
            trainingSet: []
        },
        (data)=> {
            data.trainingSet.push(word);
            addToStorage({trainingSet:data.trainingSet});
        }
    );
}

export const updateArchiveInStorage = (word: Word) => {
    getFromStorage({
            archive: []
        },
        (data)=> {
            data.archive.push(word);
            addToStorage({archive:data.archive});
        }
    );
}

export const removeFromTrainingSet = (word: Word) => {
    getFromStorage({
            trainingSet: []
        },
        (data)=> {
            data.trainingSet.remove(word);
            addToStorage({trainingSet:data.trainingSet});
        }
    );
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