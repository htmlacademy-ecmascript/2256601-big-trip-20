const OFFER_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'flight',
  'drive',
  'check-in',
  'sightseeing',
  'restaurant',
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DEFAULT: 'default',
  TIME_DOWN: 'time-down',
  PRICE_DOWN: 'price-down',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR'
};

const AUTHORIZATION = 'Basic 393wffdqw021d';

const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SourceUrl = {
  EVENTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};


export {
  OFFER_TYPES,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  AUTHORIZATION,
  END_POINT,
  Method,
  SourceUrl,
  TimeLimit
};
