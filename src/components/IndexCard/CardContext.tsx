import {ComponentType, createContext, FC, useEffect, useState} from 'react';

export enum CardStates {
    INITIAL = 0,
    TO_VERIFY = 1,
    CORRECT = 2,
    WRONG = 3
}

export type CardContextType = {
    word: string,
    setWord: (w: string) => void,
    state: CardStates
    setState:(cs: CardStates) => void
}

export const CardContext = createContext<CardContextType>(undefined!);


export const CardContextProvider: FC = ({children}) => {
    const [word, setWord] = useState('');
    const [state, setState] = useState(CardStates.INITIAL);

    // useEffect(()=> {
    //     if (word) {
    //         setState(CardStates.INITIAL);
    //     }
    // },[word]);

    return (
        <CardContext.Provider value={{
            word,
            setWord,
            state,
            setState
        }}>
            {children}
            </CardContext.Provider>
    );
};

export const withCardContext = <T extends object>(Component: ComponentType<T>) =>
    ({ ...props }: T): JSX.Element => (
        <CardContextProvider>
            <Component {...props}/>
        </CardContextProvider>

    )

