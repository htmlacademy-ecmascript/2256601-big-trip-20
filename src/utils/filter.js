import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import { FilterType } from '../const';

function getEventsByFilterType(type, events) {
  if (type === FilterType.EVERYTHING) {
    return [...events];
  }
  return events.filter((event) => {
    switch (type) {
      case FilterType.FUTURE:
        return dayjs(event.dateFrom).isAfter(dayjs());
      case FilterType.PRESENT:
        return dayjs(event.dateFrom).isSameOrBefore(dayjs()) && dayjs(event.dateTo).isSameOrAfter(dayjs());
      case FilterType.PAST:
        return dayjs(event.dateTo).isBefore(dayjs());
    }
  });
}

export { getEventsByFilterType };
