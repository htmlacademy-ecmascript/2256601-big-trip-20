import Observable from '../framework/observable.js';

export default class EventsModel extends Observable {
  #service = null;
  #events = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#events = this.#service.getEvents();
  }

  get events() {
    return this.#events;
  }

  updateEvent(updateType, update) {
    const index = this.#events.findIndex((events) => events.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting events');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this.#events.findIndex((events) => events.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting events');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  getTotalPrice() {
    //Убрал учёт дополнительных опций. Пока не знаю, как его сделать, и нужно ли по ТЗ вообще.
    return this.#events.reduce((totalPrice, event) => {
      totalPrice += event.basePrice;

      return totalPrice;
    }, 0);
  }

  getTripDates() {
    let startDate = '';
    let finishDate = '';
    switch (this.#events.length) {
      case 0:
        break;
      case 1:
        startDate = this.#events[0].dateFrom;
        break;
      default:
        startDate = this.#events[0].dateFrom;
        finishDate = this.#events[this.#events.length - 1].dateTo;
        break;
    }
    return {
      startDate,
      finishDate
    };
  }
}
