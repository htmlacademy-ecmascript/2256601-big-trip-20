import { remove, render, RenderPosition } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import { UserAction, UpdateType, EditType } from '../const.js';
import { isEscapeKey } from '../utils/common.js';

export default class AddNewPointPresenter {
  #container = null;
  #onDataChange = null;
  #onDestroy = null;
  #destinationsModel = null;
  #offersModel = null;

  #pointEditComponent = null;

  constructor ({container, onDataChange, onDestroy, destinationsModel, offersModel}) {
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init () {
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new EditFormView ({
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onFormSubmit: this.#onFormSubmit,
      onCloseClick: this.#onCloseClick,
      onDeleteClick: this.#onDeleteClick,
      type: EditType.CREATING
    });
    render(this.#pointEditComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#onDestroy();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #onFormSubmit = (point) => {
    this.#onDataChange (
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {
        id: crypto.randomUUID(),
        ...point
      },
    );
    this.destroy();
  };

  #onCloseClick = () => {
    this.destroy();
  };

  #onDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
