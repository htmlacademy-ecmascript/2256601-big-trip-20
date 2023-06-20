import { render, remove, replace } from '../framework/render.js';
import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import { UserAction, UpdateType } from '../const.js';
import { isDatesEqual } from '../utils/date.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class EventPresenter {
  #listComponent = null;

  #event = null;
  #destinations = null;
  #options = null;
  #mode = Mode.DEFAULT;

  #eventComponent = null;
  #editEventComponent = null;

  #handleDataUpdate = null;
  #handleModeChange = null;

  constructor({ listComponent, destinations, options, onDataUpdate, onModeChange }) {

    this.#listComponent = listComponent;
    this.#destinations = destinations;
    this.#options = options;
    this.#handleDataUpdate = onDataUpdate;
    this.#handleModeChange = onModeChange;
  }

  init(event) {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#editEventComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      destinations: this.#destinations,
      options: this.#options,
      onEditClick: this.#handleToggleOpen,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    if (this.#mode === Mode.EDITING) {
      this.#editEventComponent = new EditEventView(
        {
          event: this.#event,
          destinations: this.#destinations,
          options: this.#options,
          isNewEvent: false,
          onFormSubmit: this.#handleFormSubmit,
          onToggleClick: this.#handleToggleClose,
          onDeleteClick: this.#handleDeleteClick,
        }
      );
    }

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#listComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editEventComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#editEventComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editEventComponent.reset(this.#event);
      this.#replaceFormToItem();
    }
  }

  #replaceItemToForm() {
    this.#editEventComponent = new EditEventView(
      {
        event: this.#event,
        onFormSubmit: this.#handleFormSubmit,
        onToggleClick: this.#handleToggleClose,
        onDeleteClick: this.#handleDeleteClick,
        destinations: this.#destinations,
        options: this.#options,
      }
    );
    replace(this.#editEventComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToItem() {
    replace(this.#eventComponent, this.#editEventComponent);
    this.#editEventComponent.removeElement();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  //При закрытии ECS'ом состояние не скидывается
  #removeForm() {
    remove(this.#editEventComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToItem();
    }
  };

  #handleFormSubmit = (update) => {
    this.#handleDataUpdate(
      UserAction.UPDATE_EVENT,
      isDatesEqual(this.#event.dateFrom, update.dueDate) ? UpdateType.MINOR : UpdateType.PATCH,
      update);
    this.#replaceFormToItem();
  };

  #handleToggleClose = () => {
    this.#replaceFormToItem();
  };

  #handleToggleOpen = () => {
    this.#replaceItemToForm();
  };

  #handleDeleteClick = (event) => {
    this.#handleDataUpdate(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event);
    this.#removeForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataUpdate(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      { ...this.#event, isFavorite: !this.#event.isFavorite });
  };
}
