import React, {useEffect} from 'react';
import './App.scss';
import {Exoplanet} from "./models/exoplanet.model";
import {getRandomElement} from "./services/helpers";
import {Planet} from "./components/Planet/Planet";
import {Info} from "./components/Info/Info";
import {Sun} from "./components/Sun/Sun";
import {transformValues} from "./services/fetch-and-process";
import { DefaultPlanets} from "./constants/defaults";

export const App = () => {
    const [planet, setPlanet] = React.useState<Exoplanet>(getRandomElement(DefaultPlanets));
    const [suns, setSuns] = React.useState<Array<string>>(['']);

    useEffect(()=> {
        chrome?.storage?.local?.get(['allExoplanets'], (result) => {
            const randomPlanet = transformValues(getRandomElement(JSON.parse(result.allExoplanets)));
            setPlanet(randomPlanet);
        });
    },[]);

    useEffect( ()=> {
        setSuns(new Array(planet?.sy_snum).fill(''));
        },[planet]
    );


  return (
    <div className="sky" >
      <div className="stars small"/>
      <div className="stars medium"/>
      <div className="stars large"/>
      {suns?.map((value, index)=>
          (<Sun key={index} index={index}/>)
      )}
      <Planet planet={planet}/>
      <Info planet={planet}/>
    </div>
  );
}
