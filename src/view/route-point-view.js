import AbstractView from '../framework/view/abstract-view.js';
import { formatDate, getFormattedDateDiff } from '../utils/date.js';
import { capitalize } from '../utils/common.js';
import he from 'he';

function createPointOffersList(offers) {
  const offersList = offers.length === 0 ? '' :
    offers.map((offer) =>
      `<li class="event__offer">
          <span class="event__offer-title">${he.encode(offer.title)}</span>
          +€&nbsp;
          <span class="event__offers-price">${offer.price}</span>
      </li>`).join(' ');
  return `<ul class="event__selected-offers">${offersList}</ul>`;
}

function createRoutePointTemplate ({point, destinations, offers}) {
  const {basePrice, destination, dateFrom, dateTo, isFavorite, type} = point;
  const destinationTitle = destinations.find((element) => element.id === destination).name;
  const selectedOffers = offers.find((offer) => offer.type === point.type).offers.filter((offer) => point.offers.includes(offer.id));
  const dateFromDateTimeAttribute = formatDate(dateFrom, 'YYYY-MM-DD');
  const dateToDateTimeAttribute = formatDate(dateTo, 'YYYY-MM-DD');
  const startTime = formatDate(dateFrom, 'hh:mm');
  const finishTime = formatDate(dateTo, 'hh:mm');
  const startDate = formatDate(dateFrom, 'MMM DD');
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const pointDuration = getFormattedDateDiff(dateTo, dateFrom);

  return (/*html*/
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFromDateTimeAttribute}">${startDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalize(type)} ${he.encode(destinationTitle)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFromDateTimeAttribute}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateToDateTimeAttribute}">${finishTime}</time>
          </p>
          <p class="event__duration">${pointDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
          ${createPointOffersList(selectedOffers)}
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
}

export default class RoutePointView extends AbstractView {
  #point = null;
  #pointDestinations = null;
  #pointOffers = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({point, pointDestinations, pointOffers, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClick);
  }

  get template() {
    return createRoutePointTemplate({
      point: this.#point,
      destinations: this.#pointDestinations,
      offers: this.#pointOffers
    });
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #favoriteClick = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
