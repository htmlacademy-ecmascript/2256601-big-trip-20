export default class DestinationsModel {
  #service = null;
  #destinations = null;

  constructor (service) {
    this.#service = service;
    this.#destinations = this.#service.destinations;
  }

  get destinations() {
    return this.#destinations;
  }
}
