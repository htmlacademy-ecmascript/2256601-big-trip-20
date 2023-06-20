import dayjs from 'dayjs';
import { FilterType } from '../const';

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => dayjs(event.dateFrom).isAfter(dayjs())),
  [FilterType.PRESENT]: (events) => events.filter((event) => dayjs(event.dateFrom).isSame(dayjs())),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs(event.dateFrom).isBefore(dayjs())),
};

export { filter };
