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

  getOffersByType (type) {
    return this.offers.find((offer) => offer.type === type).offers;
  }
}
