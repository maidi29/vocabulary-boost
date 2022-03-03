import React, {ReactNode} from 'react';
import  './IndexCardSide.scss';

export enum Variants {
    FRONT = 'front',
    BACK = 'back'
}

export interface IndexCardSideProps {
    children: ReactNode,
    variant: Variants,
}

export const IndexCardSide = ({children, variant}: IndexCardSideProps): JSX.Element => {

    return (
        <div className={variant}>
                {children}
        </div>
    );
}
