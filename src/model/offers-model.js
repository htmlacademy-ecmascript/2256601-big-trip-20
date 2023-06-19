export default class OffersModel {
  #service = null;
  #offers = null;

  constructor (service) {
    this.#service = service;
    this.#offers = this.#service.offers;
  }

  get offers() {
    return this.#offers;
  }
}
