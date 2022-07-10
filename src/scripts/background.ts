import { waitForStorage } from "./util";

chrome.runtime.onInstalled.addListener((object) => {
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  fetchTranslation(request.word).then(sendResponse);
  return true;
});

const fetchTranslation = async (word: string) => {
  const lang = ((await waitForStorage("language")) as string) || "DE";
  const url = new URL("https://api-free.deepl.com/v2/translate");
  const params = {
    auth_key: process.env.API_KEY || "",
    text: word,
    target_lang: lang,
    source_lang: "EN",
  };
  url.search = new URLSearchParams(params).toString();
  const fetchUrl = url.toString();

  return await fetch(fetchUrl, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};

export {};
