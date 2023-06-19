import ListView from '../view/list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortsView from '../view/sort-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import { render, remove, replace } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType} from '../const.js';
import { sort } from '../utils/sort-utils.js';
import { filter } from '../utils/filter-utils.js';
import { getTripTitle } from '../utils/common.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
export default class BoardPresenter {
  #boardContainer = null;
  #headerContainer = null;
  #filterContainer = null;

  #sortComponent = null;
  #listComponent = new ListView();
  #listEmptyComponent = null;
  #newPointButtonComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filtersModel = null;

  #points = [];
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #newPointPresenter = null;
  #pointPresenters = new Map();
  #isCreating = false;

  constructor({boardContainer, headerContainer, filterContainer, destinationsModel, offersModel, pointsModel, filterModel}) {
    this.#boardContainer = boardContainer;
    this.#headerContainer = headerContainer;
    this.#filterContainer = filterContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filterModel;
    this.#points = sort[this.#currentSortType](this.#pointsModel.points);
    this.#newPointPresenter = new NewPointPresenter ({
      container: this.#listComponent.element,
      onDataChange: this.#pointChangeHandler,
      onDestroy: this.#newPointDestroyHandler,
      destinationsModel: this.#destinationsModel.destinations,
      offersModel: this.#offersModel.offers,
    });
    this.#pointsModel.addObserver(this.#onModelEventHandler);
    this.#filtersModel.addObserver(this.#onModelEventHandler);
  }

  init() {
    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderNewPointButton();
    this.#renderBoard();
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const filteredPoints = filter[this.#filterType](this.#points.points);
    return sort[this.#currentSortType](filteredPoints);
  }

  #renderBoard = () => {
    if (this.#points.length === 0 && !this.#isCreating) {
      this.#renderListEmpty();
      return;
    }
    this.#renderSort();
    this.#renderListContainer();
    this.#renderPoints();
  };

  #renderListEmpty() {
    this.#listEmptyComponent = new ListEmptyView({
      filterType: this.#filterType
    });
    render(this.#listEmptyComponent, this.#boardContainer);
  }

  #renderPoints = () => {
    this.#points.forEach((point) => this.#renderPoint(point));
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#listComponent.element,
      destinationsModel: this.#destinationsModel.destinations,
      offersModel: this.#offersModel.offers,
      onChangeData: this.#pointChangeHandler,
      onChangeMode: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #clearBoard = (resetSortType = false) => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
    remove (this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#listEmptyComponent) {
      remove(this.#listComponent);
    }
  };

  #renderTripInfo () {
    const tripInfoPresenter = new TripInfoPresenter ({
      container: this.headerContainer,
      tripTitle: getTripTitle(this.#pointsModel.points, this.#destinationsModel.destinations),
      tripDates: this.#pointsModel.getTripDates(),
      tripPrice: this.pointsModel.getTotalPrice(),
    });
    tripInfoPresenter.init();
  }

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortsView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });
    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, this.#boardContainer);
    }
  };

  #renderFilters() {
    const filterPresenter = new FilterPresenter({
      container: this.#filterContainer,
      filtersModel: this.#filtersModel,
      pointsModel: this.#pointsModel,
    });

    filterPresenter.init();
  }

  #renderListContainer = () => {
    render(this.#listComponent, this.#boardContainer);
  };

  #renderNewPointButton () {
    this.#newPointButtonComponent = new NewPointButtonView ({
      onClick: this.#newPointButtonClickHandler
    });
    render(this.#newPointButtonComponent, this.#headerContainer);
  }

  #pointChangeHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.add(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType, update);
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearBoard();
    this.#renderSort();
    this.#renderPoints();
  };

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#pointsModel.points);
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #onModelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonComponent.setDisabled(true);
    this.#newPointPresenter.init();
  };

  #newPointDestroyHandler = () => {
    this.#isCreating = false;
    this.#newPointButtonComponent.setDisabled(false);
  };
}
