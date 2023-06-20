import { DESTINATIONS, DESTINATIONS_DESCRIPTIONS } from '../const.js';
import { getRandomArrayElement, getRandomPositiveInteger } from '../utils/common';

function getRandomDestination() {

  const pictures = Array.from({ length: getRandomPositiveInteger(1, 4) }, () => ({
    src: `https://loremflickr.com/248/152?random${getRandomPositiveInteger(1, 20)}`,
    description: 'Котики лучше всех!',
  }));

  return {
    id: crypto.randomUUID(),
    name: getRandomArrayElement(DESTINATIONS),
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    pictures: pictures,
  };
}

export { getRandomDestination };
