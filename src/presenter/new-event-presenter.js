import { remove, render, RenderPosition } from '../framework/render.js';
import EditEventView from '../view/edit-event-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewEventPresenter {
  #listComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #destinations = null;
  #options = null;

  #newEventComponent = null;

  constructor({ listComponent, destinations, options, onDataChange, onDestroy }) {
    this.#listComponent = listComponent;
    this.#destinations = destinations;
    this.#options = options;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#newEventComponent !== null) {
      return;
    }

    this.#newEventComponent = new EditEventView({
      destinations: this.#destinations,
      options: this.#options,
      isNewEvent: true,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteClick: this.#deleteClickHandler,
      onToggleClick: this.#deleteClickHandler
    });

    render(this.#newEventComponent, this.#listComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newEventComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#newEventComponent);
    this.#newEventComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#newEventComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newEventComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newEventComponent.shake(resetFormState);
  }

  #formSubmitHandler = (event) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #deleteClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
