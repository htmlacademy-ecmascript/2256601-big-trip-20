import ListView from '../view/list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortsView from '../view/sort-view.js';
import { render, remove, replace } from '../framework/render.js';
import { updateItem } from '../utils/point-utils.js';
import { SortType } from '../const.js';
import PointPresenter from './point-presenter.js';
import { sort } from '../utils/sort-utils.js';
export default class BoardPresenter {
  #boardContainer = null;

  #sortComponent = null;
  #listComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #points = [];
  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();


  constructor({boardContainer, destinationsModel, offersModel, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#points = sort[SortType.DAY]([...this.#pointsModel.points]);
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#listComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onChangeData: this.#pointChangeHandler,
      onChangeMode: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#points);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => this.#renderPoint(point));
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderSort = (container) => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortsView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });
    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, container);
    }
  };

  #renderPointContainer = () => {
    this.#listComponent = new ListView();
    render(this.#listComponent, this.#boardContainer);
  };

  #renderBoard = () => {
    if (this.#points.length === 0) {
      render(new ListEmptyView(), this.#boardContainer);
      return;
    }
    this.#renderSort(this.#boardContainer);
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #pointChangeHandler = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderSort(this.#boardContainer);
    this.#renderPoints();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
