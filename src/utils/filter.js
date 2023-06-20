import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import { FilterType } from '../const';

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => dayjs(event.dateFrom).isAfter(dayjs())),
  [FilterType.PRESENT]: (events) => events.filter((event) => dayjs(event.dateFrom).isSameOrBefore(dayjs()) && dayjs(event.dateTo).isSameOrAfter(dayjs())),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs(event.dateTo).isBefore(dayjs())),
};

export { filter };
