import EditFormView from '../view/edit-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import { Mode, UserAction, UpdateType} from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';
import { isDateEqual } from '../utils/date.js';
export default class PointPresenter {
  #container = null;

  #destinationsModel = null;
  #offersModel = null;

  #onChangeData = null;
  #onChangeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #mode = Mode.DEFAULT;

  constructor ({container, destinationsModel, offersModel, onChangeData, onChangeMode}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onChangeData = onChangeData;
    this.#onChangeMode = onChangeMode;
  }

  init (point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new RoutePointView ({
      point: this.#point,
      pointDestinations: this.#destinationsModel,
      pointOffers: this.#offersModel,
      onEditClick: this.#pointEditClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    if(this.#mode === Mode.EDITING) {
      this.#pointEditComponent = new EditFormView ({
        point: this.#point,
        pointDestinations: this.#destinationsModel,
        pointOffers: this.#offersModel,
        onCloseClick: this.#closeButtonClickHandler,
        onFormSubmit: this.#formSubmitHandler,
        onDeleteClick: this.#onDeleteClick,
        isNewPoint: false,
      });
    }

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
      this.#pointEditComponent.reset(this.#point);
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
    this.#onChangeMode();
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
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #pointEditClickHandler = () => {
    this.#replacePointToForm();
  };

  #favoriteClickHandler = () => {
    this.#onChangeData (UserAction.UPDATE_POINT, UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
  };

  #closeButtonClickHandler = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #formSubmitHandler = (update) => {
    const updateType = isDateEqual(this.#point.dateFrom, update.dueDate) ? UpdateType.MINOR : UpdateType.PATCH;
    this.#onChangeData(
      UserAction.UPDATE_POINT,
      updateType,
      update,
    );
    this.#replaceFormToPoint();
  };

  #removeForm() {
    remove(this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #onDeleteClick = (point) => {
    this.#onChangeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
    this.#removeForm();
  };
}
