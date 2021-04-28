import {fetchExoplanets} from "./services/fetch-and-process";

chrome.runtime.onStartup.addListener(() => {
    fetchExoplanets();
});

chrome.runtime.onInstalled.addListener(() => {
    fetchExoplanets();
});

export {};
