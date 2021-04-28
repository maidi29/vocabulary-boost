import React from 'react';
import './Sun.scss';


export const Sun = ({index}: {index: number}) => {
    return (
      <div className={`sun sun--${index}`}/>
  );
}
