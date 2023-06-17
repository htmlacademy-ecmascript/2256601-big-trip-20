import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SortType } from '../const';

dayjs.extend(duration);
dayjs.extend(relativeTime);

function sortByTime (pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

function sortByPrice (pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortByDay (pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function (fn) {
    return [...this].sort(fn);
  };
}

const sort = {
  [SortType.DAY]: (points) => points.toSorted(sortByDay),
  [SortType.PRICE]: (points) => points.toSorted(sortByPrice),
  [SortType.TIME]: (points) => points.toSorted(sortByTime),
  [SortType.EVENT]: () => {
    throw new Error(`Sort by ${SortType.EVENT} is not implemented`);
  },
  [SortType.OFFER]: () => {
    throw new Error(`Sort by ${SortType.OFFER} is not implemented`);
  }
};

function getDateDiff(dateOne, dateTwo) {
  return dayjs(dateOne).unix() - dayjs(dateTwo).unix();
}

export {sortByTime, sortByPrice, sortByDay, sort, getDateDiff};
