import {
  requestTranslation,
  updateTrainingSetInStorage,
  waitForStorage,
} from "./util";
import { Languages } from "../model/Languages";

const id = "vocabulary-boost-overlay";
const closeId = "vocabulary-boost-close";
const addId = "vocabulary-boost-add";

const getTooltipStyle = (boundingRect: DOMRect): string => `
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
        max-width: 100%;`;

const getTooltipHTML = (translation: string): string => `
        <button id="${closeId}" title="close" style="
            align-self: flex-end;
            border: none;
            font-size: 10px;
            cursor: pointer;
            background: none;
        ">❌</button>
        <div style="font-weight: bold">${translation}</div>
        <button id="${addId}" title="add" style="
            background: #7981A4;
            color: white;
            padding: 7px 15px;
            border: none;
            cursor: pointer;
        ">Add to training set</button>`;

const sentenceCloser = new RegExp("[!?.]");
let ctrlKeyPressed = false;

const firstIndex = (str: string, regex: RegExp): number => {
  const match = str.match(regex);
  return match ? str.indexOf(match[0]) : -1;
};

const lastIndex = (str: string, regex: RegExp): number => {
  const match = str.match(regex);
  return match ? str.lastIndexOf(match[match.length - 1]) : -1;
};

const addToTrainingSetClicked = async (
  word: string,
  translation: string,
  sentence: string
): Promise<void> => {
  document.getElementById(id)?.remove();
  const lang =
    ((await waitForStorage("language")) as Languages) || Languages.DE;
  requestTranslation(sentence, (response) => {
    updateTrainingSetInStorage({
      occurance: window.location.href,
      sentence,
      sentenceTranslation: response?.translations[0].text || "",
      translation,
      word,
      language: lang,
    });
  });
};

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey) {
    ctrlKeyPressed = true;
  }
});
document.addEventListener("keyup", (e) => {
  if (e.ctrlKey) {
    ctrlKeyPressed = false;
  }
});

document.addEventListener("dblclick", () => {
  if (ctrlKeyPressed) {
    const selection = window.getSelection();
    const word = selection
      ?.toString()
      .split(" ")[0]
      .replace(new RegExp(/[.,;?!()]/g), "");
    const range = selection?.getRangeAt(0);
    const boundingRect = range?.getBoundingClientRect();

    const wholeText = selection?.focusNode?.parentElement?.textContent;
    const textBefore = wholeText?.substring(0, range?.startOffset);
    const sentenceBefore = textBefore
      ?.substring(lastIndex(textBefore, sentenceCloser) + 1)
      .trim();

    const textAfter = wholeText?.substring(range?.endOffset || 0) || "";
    const firstSentenceCloser = firstIndex(textAfter, sentenceCloser);
    const sentenceAfter = textAfter
      ?.substring(0, firstSentenceCloser !== -1 ? firstSentenceCloser + 1 : undefined)
      .trim();

    let sentence = [sentenceBefore, word, sentenceAfter].join(" ");
    if(sentence.length > 200) {
      sentence = sentence.substring(0, 200) + "...";
    }

    if (word && word.length < 50 && boundingRect) {
      requestTranslation(word, (response) => {
        const translation = response?.translations[0].text;
        showTooltip(boundingRect, translation, sentence, word);
      });
    }
  }
});

const showTooltip = (
  boundingRect: DOMRect,
  translation: string,
  sentence: string,
  word: string
): void => {
  document.getElementById(id)?.remove();

  const tooltip = document.createElement("div");
  tooltip.setAttribute("id", id);
  tooltip.setAttribute("style", getTooltipStyle(boundingRect));
  tooltip.innerHTML = getTooltipHTML(translation);
  console.log(tooltip);
  document.body.appendChild(tooltip);
  document
    .getElementById(addId)
    ?.addEventListener("click", () =>
      addToTrainingSetClicked(word, translation, sentence)
    );
  document.getElementById(closeId)?.addEventListener("click", () => {
    document.getElementById(id)?.remove();
  });
};

export {};
