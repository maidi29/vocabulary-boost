export const getRandomElement = (items: Array<any>) => items[Math.floor(Math.random() * items.length)];
export const  randomIntFromInterval = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);
export const formatDecimal = (number: number, digits: number = 2): number => +number.toFixed(digits);
