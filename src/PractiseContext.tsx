import {ComponentType, createContext, FC, useEffect, useState} from 'react';

export enum PractiseStates {
    INITIAL = 0,
    TO_VERIFY = 1,
    CORRECT = 2,
    WRONG = 3
}

export interface Word {
    word: string;
    translation: string;
    sentence: string;
    sentenceTranslation: string
    occurance: string
}

export type PractiseContextType = {
    word: Word,
    setWord: (word: Word) => void,
    state: PractiseStates
    setState:(newState: PractiseStates) => void
}

export const PractiseContext = createContext<PractiseContextType>(undefined!);


export const PractiseContextProvider: FC = ({children}) => {
    const [word, setWord] = useState({
        word: '',
        translation: '',
        sentence: '',
        sentenceTranslation: '',
        occurance: ''
    });
    const [state, setState] = useState(PractiseStates.INITIAL);

     useEffect(()=> {
         if (word) {
             setState(PractiseStates.INITIAL);
         }
     },[word]);

    return (
        <PractiseContext.Provider value={{
            word,
            setWord,
            state,
            setState
        }}>
            {children}
            </PractiseContext.Provider>
    );
};

export const withPractiseContext = <T extends object>(Component: ComponentType<T>) =>
    ({ ...props }: T): JSX.Element => (
        <PractiseContextProvider>
            <Component {...props}/>
        </PractiseContextProvider>
    )

