import { getRandomInteger } from '../utils/common.js';
import { Prise } from './const.js';
import { getDate } from './utils-mock.js';

function generatePoint (type, destinationId, offerIds) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(Prise.MIN, Prise.MAX),
    dateFrom: getDate({next: false}),
    dateTo: getDate({next: true}),
    destination: destinationId,
    isFavourite: !!getRandomInteger(0,1),
    offers: offerIds,
    type
  };
}

export {generatePoint};
