import { getDateDiff } from './date';

function compareEventPrice(eventA, eventB) {
  return eventB.basePrice - eventA.basePrice;
}

function compareEventDuration(eventA, eventB) {
  const eventADuration = getDateDiff(eventA.dateFrom, eventA.dateTo).asSeconds();
  const eventBDuration = getDateDiff(eventB.dateFrom, eventB.dateTo).asSeconds();
  return eventADuration - eventBDuration;
}

function compareEventDate(eventA, eventB) {
  const dateA = new Date(eventA.dateFrom);
  const dateB = new Date(eventB.dateFrom);
  return dateA - dateB;
}

export { compareEventPrice, compareEventDuration, compareEventDate };
