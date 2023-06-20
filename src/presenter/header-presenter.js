import TripInfoView from '../view/trip-info-view.js';
import { render, remove, RenderPosition } from '../framework/render';

export default class HeaderPresenter {
  #headerContainer = null;

  #tripTitle = null;
  #tripDates = null;
  #tripPrice = null;

  #tripComponent = null;

  constructor({ headerContainer, tripTitle, tripDates, tripPrice }) {
    this.#headerContainer = headerContainer;
    this.#tripTitle = tripTitle;
    this.#tripDates = tripDates;
    this.#tripPrice = tripPrice;
  }

  init() {
    this.#renderTripInfo();
  }

  destroy() {
    remove(this.#tripComponent);
  }

  #renderTripInfo() {
    this.#tripComponent = new TripInfoView({
      tripTitle: this.#tripTitle,
      tripDates: this.#tripDates,
      totalPrice: this.#tripPrice,
    });
    render(this.#tripComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }
}
