import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_EMPTY, TYPES, DATE_FORMAT } from '../const.js';
import { capitalize, humanizeDate} from '../utils/point-utils.js';


function createEventTypesTemplate (typeEvent) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${TYPES.map ((typeItem) =>
      `<div class="event__type-item">
            <input id="event-type-${typeItem}-1"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${typeItem}"
            ${typeEvent === typeItem ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${typeItem}"
            for="event-type-${typeItem}-1">${capitalize(typeItem)}</label>
        </div>`).join('')}
      </fieldset>
    </div>`);
}

function createDestinationsTemplate (point, pointDestinations, type) {

  const destination = pointDestinations.find((el) => el.id === point.destination);

  return (`
  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
    </label>
    <input class="event__input  event__input--destination"
    id="event-destination-1"
    type="text"
    name="event-destination"
    value="${destination.name}"
    list="destination-list-1">
    <datalist id="destination-list-1">
      ${pointDestinations.map ((item) => (
      `<option ${item.id === point.destination ? 'selected' : ''}
        value="${item.name}">
        ${item.name}
      </option>`
    ))}
    </datalist>
</div>
  `);
}

function createOffersTemplate(point, offers) {
  const offersByType = offers.find((offer) => offer.type === point.type).offers;
  const offersByIds = [...offersByType.filter((offer) => point.offers.find((id) => offer.id === id))];
  return (`
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offersByType.map(({id, price, title}) =>
      (`
      <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      data-offer-id="${id}"
      id="event-offer-${id}"
      type="checkbox"
      name="event-offer-${id}"
      ${offersByIds.find((offer) => id === offer.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>
      `)).join('')}
    </div>
  </section>
  `);
}

function createPicturesTemplate(pictures) {
  return (`
    <div class="event__photos-tape">
    ${pictures.map(({src, description}) =>
      `<img class="event__photo" src="${src}" alt="${description}">`).join('')}
    </div>
  `);
}

function createEditFormTemplate({state, pointDestinations, pointOffers}) {
  const {point} = state;
  const {basePrice, type, dateFrom, dateTo} = point;

  const destination = pointDestinations.find((el) => el.id === point.destination);

  const startTimeInForm = humanizeDate(dateFrom, DATE_FORMAT);
  const endTimeInForm = humanizeDate(dateTo, DATE_FORMAT);

  return (/*html*/`
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        ${createEventTypesTemplate(type, pointOffers)}
      </div>

      ${createDestinationsTemplate(point, pointDestinations, type)}

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTimeInForm}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeInForm}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${createOffersTemplate(point, pointOffers)}

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
            <div class="event__photos-tape">
            ${createPicturesTemplate(destination.pictures)}
            </div>
        </div>
      </section>
    </section>
  </form>
</li>
  `
  );
}

export default class EditFormView extends AbstractStatefulView {
  #pointDestinations = null;
  #pointOffers = null;
  #onFormSubmit = null;
  #onCloseEditClick = null;

  constructor({point = POINT_EMPTY, pointDestinations, pointOffers, onFormSubmit, onCloseClick}) {
    super();
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;

    this._setState(EditFormView.parsePointToState({point}));

    this.#onFormSubmit = onFormSubmit;
    this.#onCloseEditClick = onCloseClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers
    });
  }

  reset = (point) => this.updateElement({point});

  _restoreHandlers = () => {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeEditClickHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeInputClick);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChange);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChange);
    const offerBlock = this.element
      .querySelector('.event__available-offers');
    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EditFormView.parsePointToState(this._state));
  };

  #closeEditClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseEditClick();
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#pointDestinations
      .find((pointDestination) => pointDestination.name === evt.target.value);

    const selectedDestinationId = (selectedDestination)
      ? selectedDestination.id
      : null;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestinationId
      }
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId)
      }
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.value
      }
    });
  };

  static parsePointToState (point) {
    return {...point};
  }

  static parseStateToPoint (state) {
    const point = {...state};
    return point;
  }
}

