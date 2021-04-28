import React from 'react';
import './Info.scss';
import {Exoplanet, PlanetTypes} from "../../models/exoplanet.model";
import ReactHtmlParser from 'react-html-parser';
import ReactTooltip from "react-tooltip";

const typeDesc = {
    [PlanetTypes.GAS_GIANT]: "A gas giant is a large planet mostly composed of helium and/or hydrogen. These planets, " +
    "like Jupiter and Saturn in our solar system, don’t have hard surfaces and instead have swirling gases above a solid " +
    "core. Gas giant exoplanets can be much larger than Jupiter, and much closer to their stars than anything found in our solar system.",
    [PlanetTypes.NEPTUNE_LIKE]: "Neptunian exoplanets are similar in size to Neptune or Uranus in our solar system. Neptunian " +
    "planets typically have hydrogen and helium-dominated atmospheres with cores or rock and heavier metals.",
    [PlanetTypes.TERRESTRIAL]: "In our solar system, Earth, Mars, Mercury and Venus are terrestrial, or rocky, planets. For " +
    "planets outside our solar system, those between half of Earth’s size to twice its radius are considered terrestrial and " +
    "others may be even smaller. Exoplanets twice the size of Earth and larger may be rocky as well, but those are considered super-Earths.",
    [PlanetTypes.SUPER_EARTH]: "Super-Earths – a class of planets unlike any in our solar system – are more massive than " +
    "Earth yet lighter than ice giants like Neptune and Uranus, and can be made of gas, rock or a combination of both. " +
    "They are between twice the size of Earth and up to 10 times its mass.",
    [PlanetTypes.UNKNOWN]: ""
}

export const Info = ({planet}: {planet: Exoplanet}) => {
    return (
      <div className='info'>
          <div className='info--name' data-tip={true} data-for='planetDesc'>{planet.pl_name}</div>
          <ReactTooltip id='planetDesc' className='info__tooltip'>
              {planet.pl_desc}
          </ReactTooltip>
          {planet.pl_subtitle && (<div className='info--subtitle'>{planet.pl_subtitle}</div>)}
          {planet.pl_type && (
              <>
              <div className='info__row' >
                  <div data-tip={true} data-for='planetType'>Planet Type:</div>
                  <div data-tip={true} data-for='planetType'>{planet.pl_type}</div>
                </div>
              <ReactTooltip id='planetType' className='info__tooltip'>
                  {typeDesc[planet.pl_type as PlanetTypes]}
              </ReactTooltip>
              </>
          )}
          <div className='info__row'>
                <div>Size:</div>
                <div>{planet.pl_rade} Earths</div>
          </div>
          <div className='info__row'>
              <div>Mass:</div>
              <div>{planet.pl_masse} Earths</div>
          </div>
          <div className='info__row'>
              <div>Temperature:</div>
              <div>{planet.pl_eqt} °C | {planet.pl_eqt_f} °F</div>
          </div>
          <div className='info__row' >
              <div data-tip={true} data-for='orbitalPeriod'>Orbital Period:</div>
              <div data-tip={true} data-for='orbitalPeriod'>{planet.pl_orbper} Earth Days</div>
          </div>
          <ReactTooltip id='orbitalPeriod' className='info__tooltip'>
              Time the planet takes to make a complete orbit around the host star or system
          </ReactTooltip>
          <div className='info__row'>
              <div>Distance from earth:</div>
              <div>{planet.sy_dist} Light Years</div>
          </div>
          <div className='info__row'>
                <div>Number of stars in the planetary system:</div>
                <div>{planet.sy_snum}</div>
          </div>
          <div className='info--ref'>{ReactHtmlParser(planet.pl_refname)}</div>
      </div>
  );
}
