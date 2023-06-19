import Observable from '../framework/observable.js';
export default class PointsModel extends Observable {
  #service = null;
  #points = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#points = this.#service.points;
  }

  get points() {
    return this.#points;
  }

  update(UpdateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error ('Can\'t update unexisting events');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];
    this._notify(UpdateType, update);
  }

  add(UpdateType, update) {
    this.#points = [
      update,
      ...this.#points
    ];
    this._notify(UpdateType, update);
  }

  delete(UpdateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error ('Can\'t delete unexisting events');
    }

    this.#points = [
      ...this.#points.slice(0,index),
      ...this.#points.slice(index + 1)
    ];
    this._notify(UpdateType, update);
  }

  getTotalPrice() {
    return this.#points.reduce((point) => {
      let totalPrice = 0;
      totalPrice += point.basePrice;
      return totalPrice;
    }, 0);
  }

  getTripDates() {
    let startDate = '';
    let finishDate = '';
    switch (this.#points.length) {
      case 0:
        break;
      case 1:
        startDate = this.#points[0].dateFrom;
        break;
      default:
        startDate = this.#points[0].dateFrom;
        finishDate = this.#points[this.#points.length - 1].dateTo;
        break;
    }
    return {
      startDate,
      finishDate
    };
  }
}
