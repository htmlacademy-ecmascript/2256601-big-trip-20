import { render, remove, replace } from '../framework/render.js';
import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import { UserAction, UpdateType } from '../const.js';

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

    this.#eventComponent = new EventView({
      event: this.#event,
      destinations: this.#destinations,
      options: this.#options,
      onEditClick: this.#toggleOpenHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    if (prevEventComponent === null) {
      render(this.#eventComponent, this.#listComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    remove(prevEventComponent);
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editEventComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editEventComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editEventComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editEventComponent.shake(resetFormState);
  }

  #replaceItemToForm() {
    this.#editEventComponent = new EditEventView(
      {
        event: this.#event,
        destinations: this.#destinations,
        options: this.#options,
        isNewEvent: false,
        onFormSubmit: this.#formSubmitHandler,
        onToggleClick: this.#toggleCloseHandler,
        onDeleteClick: this.#deleteClickHandler,
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

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editEventComponent.reset(this.#event);
      this.#replaceFormToItem();
    }
  };

  #formSubmitHandler = (update) => {
    this.#handleDataUpdate(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      update);
  };

  #toggleCloseHandler = () => {
    this.#replaceFormToItem();
  };

  #toggleOpenHandler = () => {
    this.#replaceItemToForm();
  };

  #deleteClickHandler = (event) => {
    this.#handleDataUpdate(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event);
  };

  #favoriteClickHandler = () => {
    this.#handleDataUpdate(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      { ...this.#event, isFavorite: !this.#event.isFavorite });
  };
}
