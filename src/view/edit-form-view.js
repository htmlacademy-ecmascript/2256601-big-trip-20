import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_EMPTY, TYPES, DATE_FORMAT} from '../const.js';
import { capitalize} from '../utils/common.js';
import { formatDate } from '../utils/date.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

function createPointTypesTemplate (typePoint, types) {
  const type = (types.length === 0) ? '' :
    types.map((typeItem) =>
      `<div class="event__type-item">
        <input id="event-type-${typeItem}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${typeItem}"
        ${typePoint === typeItem ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${typeItem}"
        for="event-type-${typeItem}-1">${capitalize(typeItem)}</label>
      </div>`).join('');
  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${typePoint}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${type}
        </fieldset>
      </div>
    </div>`);
}

function createDestinationsListTemplate (destinations) {
  const destinationsList = destinations.map ((destination) =>
    `<option value="${destination.name}"></option>`).join('');
  return `<datalist id="destination-list-1">${destinationsList}</datalist>`;
}

function createDestinationPattern (destinations) {
  const cities = destinations.map((destination) => destination.name);
  const regex = `^(${cities.join('|')})`;
  return regex;
}

function createDescription (description, pictures) {
  if (description) {
    const picturesList = pictures.length === 0 ? '' :
      pictures.map((picture) =>
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${he.encode(description)}</p>
        <div class="event__photos-container">
            <div class="event__photos-tape">${picturesList}</div>
        </div>
      </section>`);
  } else {
    return '';
  }
}

function createPointOffersList(offersByType, offersPoint) {
  const offersList = offersByType.length === 0 ? '' :
    offersByType.map((offerByType) => (/*html*/
      `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="${offerByType.id}"
        type="checkbox"
        name="event-offer-luggage"
        value="${offerByType.id}"
        ${offersPoint.some((offerPoint) => offerPoint === offerByType.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="${offerByType.id}">
          <span class="event__offer-title">${he.encode(offerByType.title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerByType.price}</span>
        </label>
    </div>`)).join('');
  return `<div class="event__available-offers">${offersList}</div>`;
}

function createToggleButton(isNewPoint) {
  if (isNewPoint) {
    return '';
  } else {
    return `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>`;
  }
}

function createEditFormTemplate({state, destinations, offers, isNewPoint}) {
  const {destination, pointOffers, basePrice, type, dateFrom, dateTo} = state;
  const description = (destinations.length > 0 && destination !== null) ? destinations.find((point) => point.id === destination).description : '';
  const pointPotos = (destinations.length > 0 && destination !== null) ? destinations.find((point) => point.id === destination).pictures : [];
  const destinationName = (destinations.length > 0 && destination !== null) ? destinations.find((point) => point.id === destination).name : '';
  const destinationList = createDestinationsListTemplate(destinations);
  const pointPrice = basePrice;
  const timeFrom = formatDate(dateFrom, DATE_FORMAT);
  const timeTo = formatDate(dateTo, DATE_FORMAT);
  const offersByType = offers.find((offer) => offer.type === type).offers;
  const offersList = createPointOffersList(offersByType, pointOffers);
  const offerTypes = TYPES;
  return (/*html*/
    `<li li class="trip-events__item" >
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${createPointTypesTemplate(offerTypes, type)}
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalize(type)}
            </label>
            <input
              class="event__input  event__input--destination" id="event-destination-1"
              type="text"
              name="event-destination"
              list="destination-list-1"
              value="${he.encode(destinationName)}"
              title="Enter enlisted city"
              pattern="${createDestinationPattern(destinations)}">
              ${destinationList}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeFrom}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${he.encode(pointPrice)}"
              pattern="[1-9]\\d*"
              title="Enter a positive integer">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
          ${createToggleButton(isNewPoint)}
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            ${offersList}
          </section>
          ${createDescription(description, pointPotos)}
      </form>
    </li>`
  );
}

export default class EditFormView extends AbstractStatefulView {
  #pointDestinations = null;
  #pointOffers = null;
  #onFormSubmit = null;
  #onCloseEditClick = null;
  #onDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #isNewPoint = null;

  constructor({point = POINT_EMPTY, pointDestinations, pointOffers, onFormSubmit, onCloseClick, onDeleteClick, isNewPoint}) {
    super();
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#isNewPoint = isNewPoint;
    this.#onFormSubmit = onFormSubmit;
    this.#onCloseEditClick = onCloseClick;
    this.#onDeleteClick = onDeleteClick;

    this._setState(EditFormView.parsePointToState({point}));

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate({
      state: this._state.point,
      destinations: this.#pointDestinations,
      offers: this.#pointOffers,
      isNewPoint: this.#isNewPoint,
    });
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset (point) {
    this.updateElement(
      EditFormView.parsePointToState({point}));
  }

  _restoreHandlers = () => {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    if (this.element.querySelector('.event__rollup-btn')) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#closeEditClickHandler);
    }

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeInputClick);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChange);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteButtonClickHandler);
    this.#setDatepickers();

    const offerBlock = this.element
      .querySelector('.event__available-offers');
    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }
    this.#setDatepickers();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #closeEditClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseEditClick();
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: [],
      }
    });
  };

  #destinationChangeHandler = (evt) => {
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
        offers: checkedBoxes.map((element) => element.value)
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

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      }
    });
    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #setDatepickers() {
    const config = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
    };
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...config,
        defaultDate: this._state.point.dateFrom,
        maxDate: this._state.point.dateTo,
        onClose: this.#dateFromChangeHandler,
        locale: {
          firstDayOfWeek: 1,
        }
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...config,
        defaultDate: this._state.point.dateTo,
        minDate: this._state.point.dateFrom,
        onClose: this.#dateToChangeHandler,
        locale: {
          firstDayOfWeek: 1,
        }
      }
    );
  }

  static parsePointToState = ({point}) => ({point});
  static parseStateToPoint = (state) => state.point;
}


