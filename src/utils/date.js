import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getRandomInteger } from './common.js';

dayjs.extend(duration);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

let currentDate = new Date();

function getPointDates() {
  const startDateDelay = getRandomInteger(1, 15);
  const finishDateDelay = Math.random();
  const startDate = new Date(currentDate.getTime());
  startDate.setDate(currentDate.getDate() + startDateDelay);
  const startHour = getRandomInteger (0, 23);
  const startMinute = getRandomInteger (0, 59);
  const startSecond = getRandomInteger (0, 59);
  startDate.setHours(startHour, startMinute, startSecond);
  const finishDate = new Date(startDate.getTime() + finishDateDelay * MSEC_IN_DAY);
  currentDate = finishDate;
  const startDateISO = startDate.toISOString();
  const finishDateISO = finishDate.toISOString();

  return {
    startDate: startDateISO,
    finishDate: finishDateISO
  };
}

function formatDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function getFormattedDateDiff (dateFrom, dateTo) {
  const diff = dayjs.duration(dayjs(dateFrom).diff(dayjs(dateTo)));
  const days = diff.days();
  const hours = diff.hours();
  const minutes = diff.minutes();
  let pointDuration = '';
  if (days > 0) {
    pointDuration += `${days}D `;
  }
  if (hours > 0) {
    pointDuration += `${hours}H `;
  }
  pointDuration += `${minutes}M`;
  return pointDuration;
}

function getDateDiff(date1, date2) {
  return dayjs.duration(dayjs(date1).diff(dayjs(date2)));
}

function isDateEqual (dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export {
  getPointDates,
  formatDate,
  getFormattedDateDiff,
  getDateDiff,
  isDateEqual,
};
