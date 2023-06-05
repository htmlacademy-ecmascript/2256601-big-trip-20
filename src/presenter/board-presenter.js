import ListView from '../view/list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortsView from '../view/sort-view.js';
import { render, remove } from '../framework/render.js';
import { updatePoint } from '../utils/point-utils.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils/sort-utils.js';
import { SortType } from '../const.js';
import PointPresenter from './point-presenter.js';
export default class BoardPresenter {
  #boardContainer = null;

  #sortComponent = null;
  #listComponent = new ListView();
  #listEmptyComponent = new ListEmptyView();

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #points = [];
  #currentSortType = SortType.DAY;
  #pointPresenters = new Map();
  #sourcedListPoints = [];

  constructor({boardContainer, destinationsModel, offersModel, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
  }

  init() {
    this.#sourcedListPoints = [...this.#pointsModel.points];
    this.#renderForm();
  }

  #renderForm() {
    render(this.#listComponent, this.#boardContainer);
    if (this.#points.length === 0) {
      this.#renderEmptyPoint();
      return;
    }
    this.#renderSorts();
    this.#renderEventList();
  }


  #renderSorts = () => {
    this.#sortComponent = new SortsView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });
    render(this.#sortComponent, this.#boardContainer);
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPoints();
    this.#renderSorts();
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#points.sort(sortByDay);
        break;
      case SortType.TIME:
        this.#points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortByPrice);
        break;
      default:
        this.#points = [...this.#sourcedListPoints];
    }
    this.#currentSortType = sortType;
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
  }

  #renderEmptyPoint() {
    render (this.#listEmptyComponent, this.#boardContainer);
  }

  #renderEventList() {
    render(this.#listComponent, this.#boardContainer);
    this.#renderSorts();
    this.#renderPoints();
  }

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #pointChangeHandler = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#sourcedListPoints = updatePoint(this.#sourcedListPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#listComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      changeData: this.#pointChangeHandler,
      changeMode: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }
}


