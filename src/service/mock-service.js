import { getRandomDestination } from '../mock/destinations';
import { getRandomOfferOption } from '../mock/offers';
import { getRandomEvent } from '../mock/events';
import { OFFER_TYPES, MOCKS_COUNT } from '../const';
import { getRandomPositiveInteger, getRandomArrayElement } from '../utils/common';
import { getEventDates } from '../utils/date';

export default class MockService {
  destinations = [];
  offers = [];
  events = [];

  constructor() {
    this.destinations = this.generateDestinations();
    this.offers = this.generateOffers();
    this.events = this.generateEvents();
  }

  getDestinations() {
    return this.destinations;
  }

  getEvents() {
    return this.events;
  }

  getOffers() {
    return this.offers;
  }

  generateDestinations() {
    return Array.from({ length: MOCKS_COUNT }, getRandomDestination);
  }

  generateOffers() {
    return OFFER_TYPES.map((type) => (
      {
        type,
        offers: Array.from({ length: getRandomPositiveInteger(0, MOCKS_COUNT) }, getRandomOfferOption)
      }
    ));
  }

  generateEvents() {
    return Array.from({ length: MOCKS_COUNT }, () => {
      const type = getRandomArrayElement(OFFER_TYPES);

      const destination = getRandomArrayElement(this.destinations);

      const optionsByType = this.offers.find((optionByType) => optionByType.type === type);

      const hasOptions = getRandomPositiveInteger();

      const options = (hasOptions) ? optionsByType.offers
        .map((offer) => offer.id)
        .slice(0, getRandomPositiveInteger(0, MOCKS_COUNT))
        : [];

      const dates = getEventDates();

      return getRandomEvent(dates, destination.id, type, options);
    });
  }
}
