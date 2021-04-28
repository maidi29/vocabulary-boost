import {AdditionalResponse, Exoplanet, PlanetTypes} from "../models/exoplanet.model";
import {formatDecimal} from "./helpers";

export const fetchExoplanets = () => {
    fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,pl_orbper,pl_masse,sy_snum,sy_dist,pl_eqt,pl_refname,disc_year,sy_snum+from+ps+where+pl_masse+%3E0+and+pl_rade+%3E+0+and+pl_orbper+%3E+0+and+sy_dist+%3E+0+and+pl_eqt+between+-300+and+10000&format=csv')
        .then(r => r.text()).then(result => {
            const resultObject = csvToJson(result);
            chrome.storage.local.set({allExoplanets: JSON.stringify(resultObject)});
            resultObject.forEach((planet, index) => {
                const normalizedName = encodeURIComponent(planet?.pl_name.replaceAll(' ','_').replaceAll('"', ''));
                fetch(`https://exoplanets.nasa.gov/api/v1/planets/?condition_1=${normalizedName}:exo_id`)
                    .then(r => r.json()).then(result => {
                        const additionalResponse: AdditionalResponse = result;
                        resultObject[index].pl_type = additionalResponse.items?.[0].planet_type as PlanetTypes;
                        resultObject[index].pl_desc = additionalResponse.items?.[0].description;
                        resultObject[index].pl_subtitle = additionalResponse.items?.[0].subtitle;
                    chrome.storage.local.set({allExoplanets: JSON.stringify(resultObject)});
                });
            });
    });
}

const csvToJson = (csv: string): Exoplanet[] => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const result = lines.reduce((element, line, index) => {
        if (index !== 0 && index !== lines.length-1) {
            let planet = {};
            const currentLine = line.split(",");
            headers.map((prop: string, propIndex: number) => {
                // @ts-ignore
                planet[prop] = currentLine[propIndex];
            })
            element.push(planet);
        }
        return element;
    }, Array.prototype);

    return result as Exoplanet[];
}

export const transformValues = (planet: Exoplanet): Exoplanet => {
    return Object.assign({}, planet, {
        pl_name: planet.pl_name.replaceAll('"',''),
        pl_refname: planet.pl_refname.replaceAll('"',''),
        pl_rade: formatDecimal(+planet.pl_rade),
        pl_orbper: formatDecimal(+planet.pl_orbper, 1),
        pl_masse: formatDecimal(+planet.pl_masse),
        sy_dist: formatDecimal(parsecToLightYear(+planet.sy_dist), 0),
        pl_eqt: formatDecimal(kelvinToCelsius(+planet.pl_eqt),0),
        pl_eqt_f: formatDecimal(celsiusToFahrenheit(kelvinToCelsius(+planet.pl_eqt)),0),
        sy_snum: +planet.sy_snum,
        pl_type: planet.pl_type ? planet.pl_type : PlanetTypes.UNKNOWN,
    });
}

const parsecToLightYear = (parsec: number) => parsec * 3.2616;
const kelvinToCelsius = (kelvin: number): number => kelvin - 273.15;
const celsiusToFahrenheit = (celsius: number): number => celsius * 9 / 5 + 32;
