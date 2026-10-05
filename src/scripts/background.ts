import { waitForStorage } from "./util";

const translateMenuId = "vocabulary-boost-translate";

chrome.runtime.onInstalled.addListener((object) => {
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
  }
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: translateMenuId,
      title: 'Translate "%s" with Vocabulary Boost',
      contexts: ["selection"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === translateMenuId && tab?.id !== undefined) {
    chrome.tabs.sendMessage(
      tab.id,
      { type: "translateSelection" },
      { frameId: info.frameId }
    );
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
    method: "POST",
  })
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};

export {};
