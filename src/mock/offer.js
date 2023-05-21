import { getRandomInteger } from '../utils.js';
import { Prise } from './const.js';

function generateOffer (type) {
  return {
    id: crypto.randomUUID(),
    title: `Offer ${type}`,
    price: getRandomInteger(Prise.MIN, (Prise.MAX / 10))
  };
}

export {generateOffer};
