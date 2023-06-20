import { OFFERS, PriceRange } from '../const';
import { getRandomArrayElement, getRandomPositiveInteger } from '../utils/common';


function getRandomOfferOption() {
  return {
    id: crypto.randomUUID(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomPositiveInteger(PriceRange.MIN, PriceRange.MAX),
  };
}

export { getRandomOfferOption };
