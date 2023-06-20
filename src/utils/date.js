import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function formatDate(date, format) {
  if (!date) {
    return '';
  }
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
  if (minutes > 0) {
    result += `${minutes}M`;
  }

  return result;
}

function getDateDiff(date1, date2) {
  return dayjs.duration(dayjs(date1).diff(dayjs(date2)));
}

export {
  formatDate,
  getFormattedDateDiff,
  getDateDiff,
};
