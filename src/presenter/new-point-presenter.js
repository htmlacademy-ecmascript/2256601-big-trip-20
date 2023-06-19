import { remove, render, RenderPosition } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import { UserAction, UpdateType } from '../const.js';
import { isEscapeKey } from '../utils/common.js';

export default class NewPointPresenter {
  #container = null;

  #onDataChange = null;
  #onDestroy = null;

  #destinationsModel = null;
  #offersModel = null;

  #pointNewComponent = null;

  constructor ({container, onDataChange, onDestroy, destinationsModel, offersModel}) {
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init () {
    if (this.#pointNewComponent !== null) {
      return;
    }
    this.#pointNewComponent = new EditFormView ({
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onFormSubmit: this.#onFormSubmit,
      onCloseClick: this.#onDeleteClick,
      onDeleteClick: this.#onDeleteClick,
      isNewPoint: true,
    });
    render(this.#pointNewComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointNewComponent === null) {
      return;
    }
    this.#onDestroy();
    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #onFormSubmit = (point) => {
    this.#onDataChange (
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {
        id: crypto.randomUUID(),
        ...point,
      },
    );
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
