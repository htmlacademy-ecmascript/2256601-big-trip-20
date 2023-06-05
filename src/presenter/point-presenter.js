import EditFormView from '../view/edit-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import { Mode } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';

export default class PointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #changeData = null;
  #changeMode = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #mode = Mode.DEFAULT;

  constructor ({container, destinationsModel, offersModel, changeData, changeMode}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init (point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;
    this.#pointComponent = new RoutePointView ({
      point: this.#point,
      pointDestinations: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: this.#pointEditClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#pointEditComponent = new EditFormView ({
      point: this.#point,
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onCloseClick: this.#closeButtonClickHandler,
      onFormSubmit: this.#formSubmitHandler
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  #replacePointToForm = () => {
    replace (this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #pointEditClickHandler = () => {
    this.#replacePointToForm();
  };

  #favoriteClickHandler = () => {
    this.#changeData ({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  #closeButtonClickHandler = () => {
    this.#replaceFormToPoint();
  };

  #formSubmitHandler = (point) => {
    this.#changeData(point);
    this.#replaceFormToPoint();
  };
}
