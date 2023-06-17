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

  getById(id) {
    return this.#points.find((point) => point.id === id);
  }

  update(UpdateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
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
    this.#points = [
      ...this.#points.slice(0,index),
      ...this.#points.slice(index + 1)
    ];
    this._notify(UpdateType, update);
  }
}
