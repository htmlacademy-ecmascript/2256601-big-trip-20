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

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};

export {
  OFFER_COUNT,
  DESTINATION_COUNT,
  POINT_COUNT, TYPES,
  DEFAULT_TYPE,
  POINT_EMPTY,
  DATE_FORMAT,
  FilterType,
  Mode,
  SortType,
  UserAction,
  UpdateType,
  EditType,
};
