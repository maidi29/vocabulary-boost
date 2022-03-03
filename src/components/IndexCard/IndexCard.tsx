import React, {ReactElement, useEffect, useState} from 'react';
import  './IndexCard.scss';
import {IndexCardSideProps} from "./IndexCardSide/IndexCardSide";

type side = ReactElement<IndexCardSideProps>;

interface IndexCardProps {
    children: [side, side] | side,
    flipped?: boolean
}

export const IndexCard = ({children, flipped = false}: IndexCardProps): JSX.Element => {

    useEffect(() => {
        console.log(flipped);
    },[flipped])

    return (
        <div className="card">
            <div className={`content ${flipped && 'flip'}`}>
                {children}
            </div>
        </div>
    );
}
