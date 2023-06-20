import TripInfoView from '../view/trip-info-view.js';
import { render } from '../framework/render';

export default class HeaderPresenter {
  #headerContainer = null;

  #tripTitle = null;
  #tripDates = null;
  #tripPrice = null;

  constructor({ headerContainer, tripTitle, tripDates, tripPrice }) {
    this.#headerContainer = headerContainer;
    this.#tripTitle = tripTitle;
    this.#tripDates = tripDates;
    this.#tripPrice = tripPrice;
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    render(new TripInfoView({
      tripTitle: this.#tripTitle,
      tripDates: this.#tripDates,
      totalPrice: this.#tripPrice,
    }), this.#headerContainer);
  }
}
