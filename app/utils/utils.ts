import { animals, colors, descriptions, landscapes, types } from "./constants";

const getAnimal = (number: number) => {
  const keys = Object.keys(animals);
  return animals[keys[number]];
};

const getDescription = (number: number) => {
  const keys = Object.keys(descriptions);
  return descriptions[keys[number]];
};

const getLandscape = (number: number) => {
  const keys = Object.keys(landscapes);
  return landscapes[keys[number]];
};

const getTypes = (number: number) => {
  const keys = Object.keys(types);
  return types[keys[number]];
};

const getColor = (number: number) => {
  const keys = Object.keys(colors);
  return colors[keys[number]];
};

export const getAnimalData = (date: string) => {
  const random = Math.floor(Math.random() * 16) + 1;
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth();
  const animal = getAnimal(day);
  const description = getDescription(day);
  const color = getColor(random);
  const type = getTypes(random);
  const landscape = getLandscape(month);
  const prompt = `A ${color} ${type} ${animal} on ${landscape}`;

  return {
    prompt,
    description,
  };
};
