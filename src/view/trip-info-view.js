import AbstractView from '../framework/view/abstract-view.js';
import { formatDate } from '../utils/date.js';

function createTripDates(tripDates) {
  let dateFrom = 'Not set';
  let dateTo = 'Endpoint not set';

  if (tripDates.startDate) {
    dateFrom = formatDate(tripDates.startDate, 'MMM DD');
  }
  if (tripDates.finishDate) {
    dateTo = formatDate(tripDates.finishDate, 'MMM DD');
  }
  return `${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}`;
}

function createTripInfoTemplate(tripTitle, tripDates, totalPrice) {
  return (/*html*/
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${tripTitle}</h1>
          <p class="trip-info__dates">${createTripDates(tripDates)}</p>
        </div>
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
        </p>
      </section>`);
}

export default class TripInfoView extends AbstractView {
  #tripTitle = null;
  #tripDates = null;
  #totalPrice = null;

  constructor({ tripTitle, tripDates, totalPrice }) {
    super();
    this.#tripTitle = tripTitle;
    this.#tripDates = tripDates;
    this.#totalPrice = totalPrice;
  }

  get template() {
    return createTripInfoTemplate(this.#tripTitle, this.#tripDates, this.#totalPrice);
  }
}
