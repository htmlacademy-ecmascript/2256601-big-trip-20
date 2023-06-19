import TripInfoView from '../view/trip-info-view.js';
import { RenderPosition, render } from '../framework/render.js';

export default class TripInfoPresenter {
  #container = null;
  #tripInfoComponent = null;

  #tripTitle = null;
  #tripDates = null;
  #tripPrice = null;

  constructor ({container, tripTitle, tripDates, tripPrice}) {
    this.#container = container;
    this.#tripTitle = tripTitle;
    this.#tripDates = tripDates;
    this.#tripPrice = tripPrice;
  }

  init () {
    this.#renderTripInfo();
  }

  #renderTripInfo () {
    this.#tripInfoComponent = new TripInfoView({
      tripTitle: this.#tripTitle,
      tripDates: this.#tripDates,
      totalPrice: this.#tripPrice,
    });
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }
}
