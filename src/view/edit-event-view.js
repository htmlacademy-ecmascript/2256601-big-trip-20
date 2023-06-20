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
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: OFFER_TYPES[0],
};

function createTypesSelectList(offerTypes, eventType, isDisabled) {
  const offerType = (offerTypes.length === 0) ? '' :
    offerTypes.map((type) =>
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${(type === eventType) ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
      </div>`).join('');
  return (/*html*/
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
      </label>
      <input
        class="event__type-toggle  visually-hidden"
        id="event-type-toggle-1"
        type="checkbox"
        ${isDisabled ? 'disabled' : ''}>
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

function createEventOffersList(options, selectedOptions, isDisabled) {
  if (options.length === 0) {
    return '';
  } else {
    const offersList = options.length === 0 ? '' :
      options.map((option) => (/*html*/
        `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="${option.id}"
        type="checkbox"
        name="event-offer-luggage"
        value="${option.id}"
        ${isDisabled ? 'disabled' : ''}
        ${selectedOptions.some((selectedOption) => selectedOption === option.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="${option.id}">
          <span class="event__offer-title">${he.encode(option.title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${option.price}</span>
        </label>
    </div>`)).join('');
    return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">${offersList}</div>
          </section>`;
  }
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

function createCancelButtonText(isNewEvent, isDeleting) {
  if (isNewEvent) {
    return 'Cancel';
  } else if (isDeleting) {
    return 'Deleting...';
  } else {
    return 'Delete';
  }
}

function createEditEventTemplate({ state, destinations, options, isNewEvent }) {
  const { destination, type, offers, dateFrom, dateTo, basePrice, isDisabled, isSaving, isDeleting } = state;
  const description = (destinations.length > 0 && destination !== null) ? destinations.find((point) => point.id === destination).description : '';
  const eventPhotos = (destinations.length > 0 && destination !== null) ? destinations.find((point) => point.id === destination).pictures : [];
  const destinationName = (destinations.length > 0 && destination !== null) ? destinations.find((point) => point.id === destination).name : '';
  const destinationList = createDestinationsList(destinations);
  const eventPrice = basePrice;
  const timeFrom = formatDate(dateFrom, 'DD/MM/YY HH:mm');
  const timeTo = formatDate(dateTo, 'DD/MM/YY HH:mm');
  const optionsByType = options.find((option) => option.type === type).offers;
  const offersList = createEventOffersList(optionsByType, offers, isDisabled);
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
              required
              ${isDisabled ? 'disabled' : ''}
              pattern="${createDestinationPattern(destinations)}">
              ${destinationList}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              required
              placeholder="d/m/y h:m"
              ${isDisabled ? 'disabled' : ''}
              value="${timeFrom}">
              &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              required
              placeholder="d/m/y h:m"
              ${isDisabled ? 'disabled' : ''}
              value="${timeTo}">
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
              required
              ${isDisabled ? 'disabled' : ''}
              title="Enter a positive integer">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset">${createCancelButtonText(isNewEvent, isDeleting)}</button>
          ${createToggleButton(isNewEvent)}
        </header>
        <section class="event__details">
          ${offersList}
          ${createDescription(description, eventPhotos)}
        </section>
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

    this._setState(EditEventView.parseEventToState(event));

    this._restoreHandlers();
  }

  get template() {
    return createEditEventTemplate({
      event: this.#event,
      state: this._state,
      destinations: this.#destinations,
      options: this.#options,
      isNewEvent: this.#isNewEvent
    });
  }

  _restoreHandlers = () => {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    if (this.element.querySelector('.event__rollup-btn')) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#toggleClickHandler);
    }

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeFieldsetChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    const optionsContainer = this.element.querySelector('.event__available-offers');

    if (optionsContainer) {
      optionsContainer.addEventListener('change', this.#optionClickHandler);
    }

    this.#setDatePickers();
  };

  reset(event) {
    this.updateElement(
      EditEventView.parseEventToState(event),
    );
  }

  removeElement = () => {
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

  #setDatePickers = () => {
    const inputFrom = this.element.querySelector('#event-start-time-1');
    const inputTo = this.element.querySelector('#event-end-time-1');
    this.#datePickerFrom = flatpickr(
      inputFrom, {
        dateFormat: 'd/m/y H:i',
        allowInput: true,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        'time_24hr': true,
        locale: {
          firstDayOfWeek: 1,
        }
      });

    this.#datePickerTo = flatpickr(
      inputTo, {
        dateFormat: 'd/m/y H:i',
        allowInput: true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        'time_24hr': true,
        locale: {
          firstDayOfWeek: 1,
        }
      });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditEventView.parseStateToEvent(this._state));
  };

  #toggleClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleToggleClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditEventView.parseStateToEvent(this._state));
  };

  #typeFieldsetChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state,
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const input = evt.target;
    const selectedDestination = input.value;
    const isValidDestination = this.#destinations.find((destination) => destination.name === selectedDestination);
    if (isValidDestination) {
      const selectedDestinationId = this.#destinations.find((destination) => destination.name === selectedDestination).id;

      this.updateElement({
        ...this._state,
        destination: selectedDestinationId,
      });
    } else {
      input.setCustomValidity('Choose a city from the list');
      input.reportValidity();
    }
  };

  #optionClickHandler = (evt) => {
    evt.preventDefault();
    const selectedOptions = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      ...this._state,
      offers: selectedOptions.map((option) => option.value)
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      ...this._state,
      basePrice: Number(evt.target.value),
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateTo: userDate
    });

    this.#datePickerFrom.set('maxDate', this._state.dateTo);
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateFrom: userDate
    });

    this.#datePickerTo.set('minDate', this._state.dateFrom);
  };

  static parseEventToState = (event) => ({
    ...event,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToEvent = (state) => {
    const event = { ...state };
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;

    return event;
  };
}
