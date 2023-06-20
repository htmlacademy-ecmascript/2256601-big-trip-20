import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getRandomPositiveInteger } from './common.js';

dayjs.extend(duration);

let currentDate = new Date();

function getEventDates() {
  const startDateDelay = getRandomPositiveInteger(1, 15);
  const finishDateDelay = Math.random();
  const startDate = new Date(currentDate.getTime());
  startDate.setDate(currentDate.getDate() + startDateDelay);
  const startHour = getRandomPositiveInteger(0, 23);
  const startMinute = getRandomPositiveInteger(0, 59);
  const startSecond = getRandomPositiveInteger(0, 59);
  startDate.setHours(startHour, startMinute, startSecond);
  const finishDate = new Date(startDate.getTime() + finishDateDelay * 24 * 60 * 60 * 1000);
  currentDate = finishDate;
  const startDateISO = startDate.toISOString();
  const finishDateISO = finishDate.toISOString();

  return {
    startDate: startDateISO,
    finishDate: finishDateISO
  };
}

function formatDate(date, format) {
  return dayjs(date).format(format);
}

function getFormattedDateDiff(date1, date2) {
  const diff = dayjs.duration(dayjs(date1).diff(dayjs(date2)));
  const days = diff.days();
  const hours = diff.hours();
  const minutes = diff.minutes();
  let result = '';
  if (days > 0) {
    result += `${days}D `;
  }
  if (hours > 0) {
    result += `${hours}H `;
  }
  result += `${minutes}M`;
  return result;
}

function getDateDiff(date1, date2) {
  return dayjs.duration(dayjs(date1).diff(dayjs(date2)));
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export {
  getRandomPositiveInteger,
  getEventDates,
  formatDate,
  getFormattedDateDiff,
  getDateDiff,
  isDatesEqual
};
