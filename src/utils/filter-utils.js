import dayjs from 'dayjs';
import { FilterType } from '../const.js';

function isPointFuture(point) {
  return dayjs(point.dateFrom).isAfter(dayjs());
}

function isPointPresent (point) {
  return dayjs(point.dateFrom).isSame(dayjs());
}

function isPointPast(point) {
  return dayjs(point.dateFrom).isBefore(dayjs());
}

const filter = {
  [FilterType.EVERYTHING] :(points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

export {filter};
