import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
import RoutePointView from '../view/route-point-view.js';
import { render, replace } from '../framework/render.js';

export default class BoardPresenter {
  #listComponent = new ListView();
  #boardContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #points = [];

  constructor({boardContainer, destinationsModel, offersModel, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
  }

  init() {
    render(this.#listComponent, this.#boardContainer);
    this.#points.forEach((point) => {
      this.#renderPoint({
        point,
        pointDestinations: this.#destinationsModel.getById(point.destination),
        pointOffers: this.#offersModel.getByType(point.type)
      });
    });
  }

  #renderPoint (point) {
    const pointComponent = new RoutePointView ({
      point,
      pointDestinations: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: pointEditClickHandler
    });

    const pointEditComponent = new EditFormView ({
      point: this.#points[0],
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onCloseClick: CloseButtonClickHandler,
      onFormSubmit: pointSubmitHandler
    });

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function pointEditClickHandler () {
      replacePointToForm();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function CloseButtonClickHandler () {
      replaceFormToPoint ();
      document.removeEventListener('keydown', escKeyDownHandler);
    }
    function pointSubmitHandler () {
      replaceFormToPoint ();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function replaceFormToPoint () {
      replace (pointEditComponent, pointComponent);
    }

    function replacePointToForm () {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#listComponent.element);
  }
}
