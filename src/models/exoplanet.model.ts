export enum PlanetTypes {
    SUPER_EARTH = 'Super Earth',
    NEPTUNE_LIKE = 'Neptune-like',
    GAS_GIANT = 'Gas Giant',
    TERRESTRIAL = 'Terrestrial',
    UNKNOWN = 'unknown'
}

export interface Exoplanet {
    pl_name: string,
    pl_rade: number, // earth rade (0.29 - 77.342)
    pl_masse: number, // earth mass (0.02 - 9534.9)
    pl_orbper: number, // earth days (0.09 - 7.300.000)
    sy_dist: number, // parsec (1.3 - 8500)
    pl_eqt: number, // kelvin (50 - 4050)
    pl_eqt_f?: number,
    pl_refname: string,
    disc_year: number,
    sy_snum: number, // (1 - 4),
    pl_type?: PlanetTypes | string,
    pl_desc?: string,
    pl_subtitle?: string
}

export interface AdditionalResponse {
    items?: (ItemsEntity)[] | null;
    more: boolean;
    total: number;
    page: number;
    per_page: number;
}
export interface ItemsEntity {
    id: number;
    pl_hostname: string;
    pl_letter: string;
    display_name: string;
    description: string;
    discovery_date: string;
    url: string;
    title: string;
    feature_title: string;
    mass_display: string;
    planet_type: string;
    st_dist: number;
    st_optmag: number;
    pl_radj: number;
    pl_rade: number;
    pl_massj: number;
    pl_discmethod: string;
    image: string;
    list_image: string;
    short_description: string;
    ranger_feature_id: string;
    ranger_system_id: string;
    ranger_system: boolean;
    exo_id: string;
    subtitle: string;
    categories?: (null)[] | null;
    pl_kepflag: boolean;
    pl_facility: string;
    long_description?: null;
}

