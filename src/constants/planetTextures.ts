import {PlanetTypes} from "../models/exoplanet.model";

export const PlanetTextures = {
    [PlanetTypes.GAS_GIANT]: [
        'saturn.jpg', 'venus.jpg', 'neptune.jpg'
    ],
    [PlanetTypes.NEPTUNE_LIKE]: [
        'saturn.jpg', 'venus.jpg', 'neptune.jpg'
    ],
    [PlanetTypes.SUPER_EARTH]: [
        'ceres.jpg', 'eris.jpg', 'haumea.jpg', 'makemake.jpg'
    ],
    [PlanetTypes.TERRESTRIAL]: [
        'ceres.jpg', 'eris.jpg', 'haumea.jpg', 'makemake.jpg'
    ],
    [PlanetTypes.UNKNOWN]: [
        'ceres.jpg', 'eris.jpg', 'haumea.jpg', 'makemake.jpg', 'saturn.jpg', 'venus.jpg', 'neptune.jpg'
    ]
}
