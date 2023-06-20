import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
import { compareEventDate } from '../utils/sort.js';

export default class TripModel extends Observable {
  #service = null;
  #events = [];
  #offers = [];
  #destinations = [];

  constructor({ service }) {
    super();
    this.#service = service;
  }

  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const events = await this.#service.getEvents();
      this.#events = events.map(this.#adaptToClient);
      this.#destinations = await this.#service.getDestinations();
      this.#offers = await this.#service.getOffers();
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#events = [];
      this.#destinations = [];
      this.#offers = [];
      this._notify(UpdateType.ERROR);
    }
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((events) => events.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting events');
    }

    try {
      const response = await this.#service.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response);
      this.#events = [
        ...this.#events.slice(0, index),
        update,
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error('Can\'t update event');
    }
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#service.addEvent(update);
      const newEvent = this.#adaptToClient(response);
      this.#events = [newEvent, ...this.#events];
      this._notify(updateType, newEvent);
    } catch(err) {
      throw new Error('Can\'t add event');
    }
  }

  async deleteEvent(updateType, update) {
    const index = this.#events.findIndex((events) => events.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting events');
    }

    try {
      await this.#service.deleteEvent(update);
      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }
  }

  getTotalPrice() {
    const offersByType = this.#getOffersByType();

    return this.events.reduce((totalPrice, event) => {
      totalPrice += event.basePrice;

      offersByType[event.type].forEach((offer) => {
        if (event.offers.includes(offer.id)) {
          totalPrice += offer.price;
        }
      });

      return totalPrice;
    }, 0);
  }

  getTripDates() {
    const sortedByDateEvents = [...this.events].sort(compareEventDate);
    let startDate = '';
    let finishDate = '';
    switch (sortedByDateEvents.length) {
      case 0:
        break;
      case 1:
        startDate = sortedByDateEvents[0].dateFrom;
        break;
      default:
        startDate = sortedByDateEvents[0].dateFrom;
        finishDate = sortedByDateEvents[sortedByDateEvents.length - 1].dateTo;
        break;
    }
    return {
      startDate,
      finishDate
    };
  }

  getTripTitle() {
    const sortedByDateEvents = [...this.events].sort(compareEventDate);
    let firstDestinationTitle = 'Set the first waypoint.';
    let middleDestinationTitle = 'Set the second waypoint.';
    let endDestinationTitle = '';
    let tripTitle = 'Route not set.';
    switch (sortedByDateEvents.length) {
      case 0:
        break;
      case 1:
        firstDestinationTitle = this.#destinations.find((point) => point.id === sortedByDateEvents[0].destination).name;

        tripTitle = `${firstDestinationTitle} — Add an endpoint`;
        break;
      case 2:
        firstDestinationTitle = this.#destinations.find((point) => point.id === sortedByDateEvents[0].destination).name;
        middleDestinationTitle = this.#destinations.find((point) => point.id === sortedByDateEvents[1].destination).name;

        tripTitle = `${firstDestinationTitle} — ${middleDestinationTitle}`;
        break;
      case 3:
        firstDestinationTitle = this.#destinations.find((point) => point.id === sortedByDateEvents[0].destination).name;
        middleDestinationTitle = this.#destinations.find((point) => point.id === sortedByDateEvents[1].destination).name;
        endDestinationTitle = this.#destinations.find((point) => point.id === sortedByDateEvents[2].destination).name;

        tripTitle = `${firstDestinationTitle} — ${middleDestinationTitle} — ${endDestinationTitle}`;
        break;
      default:
        firstDestinationTitle = this.#destinations.find((point) => point.id === sortedByDateEvents[0].destination).name;
        endDestinationTitle = this.#destinations.find((point) => point.id === sortedByDateEvents[sortedByDateEvents.length - 1].destination).name;

        tripTitle = `${firstDestinationTitle} — … — ${endDestinationTitle}`;
    }

    return tripTitle;
  }

  #getOffersByType() {
    const offersByType = {};
    this.offers.forEach((offer) => {
      offersByType[offer.type] = offer.offers;
    });
    return offersByType;
  }

  #adaptToClient(event) {
    const adaptedEvent = {
      ...event,
      dateFrom: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'],
      dateTo: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'],
      basePrice: event['base_price'],
      isFavorite: event['is_favorite'],
    };

    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['base_price'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }
}
