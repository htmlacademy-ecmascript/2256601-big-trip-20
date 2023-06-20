import flatpickr from 'flatpickr';
import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { OFFER_TYPES } from '../const.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import { formatDate } from '../utils/date.js';


import 'flatpickr/dist/flatpickr.min.css';

const EMPTY_EVENT = {
  id: 0,
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  destination: null,
  isFavorite: false,
  offers: [],
  type: OFFER_TYPES[0],
};

function createTypesSelectList(offerTypes, eventType) {
  const offerType = (offerTypes.length === 0) ? '' :
    offerTypes.map((type) =>
      `<div class="event__type-item">
        <input id="event-type-${type}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${(type === eventType) ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}"
        for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
      </div>`).join('');
  return (/*html*/
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${offerType}
        </fieldset>
      </div>
    </div>`);
}

function createDestinationsList(destinations) {
  const destinationsList = destinations.map((destination) =>
    `<option value="${destination.name}"></option>`).join('');
  return `<datalist id="destination-list-1">${destinationsList}</datalist>`;
}

function createDestinationPattern(destinations) {
  const cities = destinations.map((destination) => destination.name);
  const regex = `^(${cities.join('|')})$`;
  return regex;
}

function createDescription(description, pictures) {
  if (description) {
    const picturesList = pictures.length === 0 ? '' :
      pictures.map((picture) =>
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');
    return `
      <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${he.encode(description)}</p>
        <div class="event__photos-container">
            <div class="event__photos-tape">${picturesList}</div>
        </div>
      </section>`;
  } else {
    return '';
  }
}

function createEventOffersList(options, selectedOptions) {
  const offersList = options.length === 0 ? '' :
    options.map((option) => (/*html*/
      `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="${option.id}"
        type="checkbox"
        name="event-offer-luggage"
        value="${option.id}"
        ${selectedOptions.some((selectedOption) => selectedOption === option.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="${option.id}">
          <span class="event__offer-title">${he.encode(option.title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${option.price}</span>
        </label>
    </div>`)).join('');
  return `<div class="event__available-offers">${offersList}</div>`;
}

function createToggleButton(isNewEvent) {
  if (isNewEvent) {
    return '';
  } else {
    return `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>`;
  }
}

function createEditEventTemplate({ state, destinations, options, isNewEvent }) {
  const { destination, type, offers, dateFrom, dateTo, basePrice } = state;
  const description = (destinations.length > 0 && destination !== null) ? destinations.find((point) => point.id === destination).description : '';
  const eventPhotos = (destinations.length > 0 && destination !== null) ? destinations.find((point) => point.id === destination).pictures : [];
  const destinationName = (destinations.length > 0 && destination !== null) ? destinations.find((point) => point.id === destination).name : '';
  const destinationList = createDestinationsList(destinations);
  const eventPrice = basePrice;
  const timeFrom = formatDate(dateFrom, 'DD/MM/YY hh:mm');
  const timeTo = formatDate(dateTo, 'DD/MM/YY hh:mm');
  const optionsByType = options.find((option) => option.type === type).offers;
  const offersList = createEventOffersList(optionsByType, offers);
  const offerTypes = OFFER_TYPES;

  return (/*html*/
    `<li li class="trip-events__item" >
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${createTypesSelectList(offerTypes, type)}
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)}
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
                  value="${eventPrice}"
                  pattern="[1-9]\\d*"
                  title="Enter a positive integer">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">${isNewEvent ? 'Cancel' : 'Delete'}</button>
              ${createToggleButton(isNewEvent)}
            </header>
            <section class="event__details">
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                ${offersList}
              </section>
              ${createDescription(description, eventPhotos)}
          </form>
        </li>`
  );
}

export default class EditEventView extends AbstractStatefulView {
  #event = null;
  #destinations = null;
  #options = null;
  #isNewEvent = null;
  #handleFormSubmit = null;
  #handleToggleClick = null;
  #handleDeleteClick = null;

  #datePickerFrom = null;
  #datePickerTo = null;

  constructor({ event = EMPTY_EVENT, destinations, options, isNewEvent, onFormSubmit, onToggleClick, onDeleteClick }) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#options = options;
    this.#isNewEvent = isNewEvent;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleToggleClick = onToggleClick;
    this.#handleDeleteClick = onDeleteClick;

    this._setState(EditEventView.parseEventToState({event}));

    this._restoreHandlers();
  }

  static parseEventToState = ({ event }) => ({ event });//гуд

  static parseStateToEvent = (state) => state.event; //гуд

  #formSubmitHandler = (evt) => { //гуд
    evt.preventDefault();
    this.#handleFormSubmit(EditEventView.parseStateToEvent(this._state));
  };

  #toggleClickHandler = (evt) => { //гуд
    evt.preventDefault();
    this.#handleToggleClick();
  };

  #deleteClickHandler = (evt) => { //гуд
    evt.preventDefault();
    this.#handleDeleteClick(EditEventView.parseStateToEvent(this._state));
  };

  #typeFieldsetChangeHandler = (evt) => { //гуд
    evt.preventDefault();
    this.updateElement({
      event: {
        ...this._state.event,
        type: evt.target.value,
        offers: [],
      }
    });
  };

  #destinationChangeHandler = () => { //гуд
    const input = this.element.querySelector('.event__input--destination');
    const selectedDestination = input.value;
    //Как-то с неймингом здесь у меня туго.
    const isValidDestination = this.#destinations.find((destination) => destination.name === selectedDestination);
    if (isValidDestination) {
      const selectedDestinationId = this.#destinations.find((destination) => destination.name === selectedDestination).id;

      this.updateElement({
        event: {
          ...this._state.event,
          destination: selectedDestinationId,
        }
      });
    } else {
      input.setCustomValidity('Choose a city from the list');
      input.reportValidity();
    }
  };

  #optionClickHandler = (evt) => { // гуд
    evt.preventDefault();
    const selectedOptions = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      event: {
        ...this._state.event,
        offers: selectedOptions.map((option) => option.value)
      }
    });
  };

  #priceChangeHandler = (evt) => { //гуд
    evt.preventDefault();

    this._setState({
      event: {
        ...this._state.event,
        basePrice: evt.target.value,
      }
    });
  };

  #dateToChangeHandler = ([userDate]) => { //гуд
    this._setState({
      event: {
        ...this._state.event,
        dateTo: userDate
      }
    });

    this.#datePickerFrom.set('maxDate', this._state.event.dateTo);
  };

  #dateFromChangeHandler = ([userDate]) => { // гуд
    this._setState({
      event: {
        ...this._state.event,
        dateFrom: userDate
      }
    });

    this.#datePickerTo.set('minDate', this._state.event.dateFrom);
  };

  #setDatePickers = () => { //гуд
    this.#datePickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'), {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.event.dateFrom,
        maxDate: this._state.event.dateTo,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        'time_24hr': true,
        locale: {
          firstDayOfWeek: 1,
        }
      }
    );

    this.#datePickerTo = flatpickr( //гуд
      this.element.querySelector('#event-end-time-1'), {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.event.dateTo,
        minDate: this._state.event.dateFrom,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        'time_24hr': true,
        locale: {
          firstDayOfWeek: 1,
        }
      }
    );
  };

  _restoreHandlers = () => {
    this.element //гуд
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    if (this.element.querySelector('.event__rollup-btn')) { //гуд
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#toggleClickHandler);
    }

    this.element // гуд
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.element // гуд
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeFieldsetChangeHandler);

    this.element // гуд
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);

    this.element // гуд
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    const optionsContainer = this.element.querySelector('.event__available-offers'); //гуд
    if (optionsContainer) { //гуд
      optionsContainer.addEventListener('change', this.#optionClickHandler);
    }

    this.#setDatePickers(); //good

  };

  get template() { // good
    return createEditEventTemplate({
      event: this.#event,
      state: this._state.event,
      destinations: this.#destinations,
      options: this.#options,
      isNewEvent: this.#isNewEvent
    });
  }

  reset(event) { //good
    this.updateElement(
      EditEventView.parseEventToState(event),
    );
  }

  removeElement = () => { //good
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  };
}

