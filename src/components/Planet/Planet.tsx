import React, {useEffect, useLayoutEffect, useState} from 'react';
import './Planet.scss';
import {getRandomElement, randomIntFromInterval} from "../../services/helpers";
import {PlanetTextures} from "../../constants/planetTextures";
import useResizeObserver from "@react-hook/resize-observer";
import {Exoplanet, PlanetTypes} from "../../models/exoplanet.model";

const useSize = (target: any) => {
    const [size, setSize] = React.useState();
    useLayoutEffect(() => {
        setSize(target.current.getBoundingClientRect())
    }, [target])
    useResizeObserver(target, (entry) => setSize(entry.contentRect as any))
    return size;
}

export const Planet = ({planet}: {planet: Exoplanet}) => {
    const target = React.useRef<HTMLDivElement>(null)
    const size: DOMRectReadOnly = useSize(target) || new DOMRectReadOnly();
    let surface = planet.pl_type ? getRandomElement(PlanetTextures[planet.pl_type as PlanetTypes]) : getRandomElement(PlanetTextures[PlanetTypes.UNKNOWN]);

    const [style, setStyle] = useState<React.CSSProperties>({
        "--planet-texture": `url(/images/${surface})`,
        "--planet-color-r": randomIntFromInterval(0,255),
        "--planet-color-g": randomIntFromInterval(0,255),
        "--planet-color-b": randomIntFromInterval(0,255),
        "--planet-tilt": `${randomIntFromInterval(0,35)}deg`,
        "--rotate-speed": `${randomIntFromInterval(15,35)}s`,
        "--shadow-width":`${randomIntFromInterval(-110,-60)}px`,
        "--planet-width": `${size?.height}px`,
        "--planet-height": '50vh'
    } as React.CSSProperties);

    useEffect(() => {
        surface = planet.pl_type ? getRandomElement(PlanetTextures[planet.pl_type as PlanetTypes]) : getRandomElement(PlanetTextures[PlanetTypes.UNKNOWN]);
        setStyle(Object.assign({}, style, {"--planet-texture": `url(/images/${surface})`}));
    },[planet]);

    useEffect(() => {
        const width = size?.height ? size.height : 300;
        if(!size?.height) {
            setStyle(Object.assign({}, style, {"--planet-height": `${width}px`}));
        }
        setStyle(Object.assign({}, style, {"--planet-width": `${width}px`}));
    },[size]);

    return (
      <div className="planet" style={style} ref={target}>
          <div className="planet__atmosphere">
            <div className="planet__surface"/>
          </div>
      </div>
  );
}
