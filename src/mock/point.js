import { getRandomInteger } from '../utils/common.js';
import { Prise } from './const.js';


function generatePoint (type, destinationId, offerIds, dates) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(Prise.MIN, Prise.MAX),
    dateFrom: dates.startDate,
    dateTo: dates.finishDate,
    destination: destinationId,
    isFavourite: !!getRandomInteger(0,1),
    offers: offerIds,
    type
  };
}

export {generatePoint};
