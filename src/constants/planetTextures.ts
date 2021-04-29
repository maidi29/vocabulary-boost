import {PlanetTypes} from "../models/exoplanet.model";

export const PlanetTextures = {
    [PlanetTypes.GAS_GIANT]: [
        'saturn.webp', 'venus.webp', 'neptune.webp','neptunelight.webp','saturnlight.webp','venuslight.webp'
    ],
    [PlanetTypes.NEPTUNE_LIKE]: [
        'saturn.webp', 'venus.webp', 'neptune.webp','neptunelight.webp','saturnlight.webp','venuslight.webp'
    ],
    [PlanetTypes.SUPER_EARTH]: [
        'neptunelight.webp','saturnlight.webp','venuslight.webp'
    ],
    [PlanetTypes.TERRESTRIAL]: [
        'neptunelight.webp','saturnlight.webp','venuslight.webp'
    ],
    [PlanetTypes.UNKNOWN]: [
        'ceres.webp', 'eris.webp', 'haumea.webp', 'makemake.webp', 'saturn.webp', 'venus.webp', 'neptune.webp', 'neptunelight.webp','saturnlight.webp','venuslight.webp'
    ]
}
