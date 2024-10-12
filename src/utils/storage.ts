import { Adventure } from '../types';

const ADVENTURES_KEY = 'adventures';

export const saveAdventures = (adventures: Adventure[]): void => {
  localStorage.setItem(ADVENTURES_KEY, JSON.stringify(adventures));
};

export const getAdventures = (): Adventure[] => {
  const adventures = localStorage.getItem(ADVENTURES_KEY);
  return adventures ? JSON.parse(adventures) : [];
};

export const saveAdventure = (adventure: Adventure): void => {
  const adventures = getAdventures();
  const index = adventures.findIndex((a) => a.id === adventure.id);
  if (index !== -1) {
    adventures[index] = adventure;
  } else {
    adventures.push(adventure);
  }
  saveAdventures(adventures);
};

export const deleteAdventure = (id: string): void => {
  const adventures = getAdventures();
  const updatedAdventures = adventures.filter((a) => a.id !== id);
  saveAdventures(updatedAdventures);
};