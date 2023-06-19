import { getRandomValue } from '../utils/common.js';
import { CITIES, DESCRIPTIONS } from './const.js';

function generateDestination () {
  const city = getRandomValue(CITIES);

  return {
    id: crypto.randomUUID(),
    name: city,
    description: getRandomValue(DESCRIPTIONS),
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
        description: `${city} description`
      }
    ]
  };
}

export {generateDestination};

