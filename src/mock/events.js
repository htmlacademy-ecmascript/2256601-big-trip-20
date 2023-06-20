import { PriceRange } from '../const';
import { getRandomPositiveInteger } from '../utils/common';

function getRandomEvent(dates, destinationName, type, options) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomPositiveInteger(PriceRange.MIN, PriceRange.MAX),
    dateFrom: dates.startDate,
    dateTo: dates.finishDate,
    destination: destinationName,
    isFavorite: !!getRandomPositiveInteger(),
    offers: options,
    type: type,
  };
}

export { getRandomEvent };
