const OFFER_TYPES = [
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

const DESTINATIONS = [
  'Chaomix',
  'Geneve',
  'Amsterdam',
  'Helsinki',
  'Oslo',
  'Kopenhagen',
  'Den Haag',
  'Rotterdam',
  'Saint Petersburg',
  'Moscow',
  'Sochi',
  'Tokio'
];

const DESTINATIONS_DESCRIPTIONS = [
  'The city of incredible beauty is somewhere very far from this place. And this place would have won the Terrible Hole of the Year competition, if the organizers of the competition had known about this hole.',
  'The city is known for swarms of mutant mosquitoes that can pick up and carry a medium-sized child into the forests.',
  'The resorts of this city were famous in the 18th century. Since then they have not been repaired.',
  'Incredibly clean air could be here if it were not for emissions from a metallurgical plant.',
  'Stephen King only writes about Derry in his novels because he doesn\'t know about this place.',
];

const OFFERS = [
  'Don\'t listen to chanson',
  'Guide to bars',
  'Non-swearing driver',
  'Don\'t lose luggage during transportation',
  'The correct answer to the question "From what district?"',
  'Order a knife',
  'Don\'t cut the kidney',
  'Carry a bomb in your luggage',
  'Steer the plane',
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

const PriceRange = {
  MIN: 200,
  MAX: 9000,
};

const MOCKS_COUNT = 6;

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

export {
  OFFER_TYPES,
  DESTINATIONS,
  OFFERS,
  DESTINATIONS_DESCRIPTIONS,
  FilterType,
  PriceRange,
  MOCKS_COUNT,
  SortType,
  UserAction,
  UpdateType
};
