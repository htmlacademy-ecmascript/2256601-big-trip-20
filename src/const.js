const OFFER_COUNT = 5;
const DESTINATION_COUNT = 5;
const POINT_COUNT = 5;

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const DEFAULT_TYPE = 'flight';

const POINT_EMPTY = {
  basePrise: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavourite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

export {OFFER_COUNT, DESTINATION_COUNT, POINT_COUNT, TYPES, DEFAULT_TYPE, POINT_EMPTY, DATE_FORMAT, FilterType, Mode, SortType};
