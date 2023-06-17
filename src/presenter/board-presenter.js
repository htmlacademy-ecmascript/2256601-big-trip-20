import ListView from '../view/list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortsView from '../view/sort-view.js';
import { render, remove, replace } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType} from '../const.js';
import { sort } from '../utils/sort-utils.js';
import { filter } from '../utils/filter-utils.js';
import PointPresenter from './point-presenter.js';
import AddNewPointPresenter from './add-new-point-presenter.js';
import NewPointButtonView from '../view/new-point-button-view.js';
export default class BoardPresenter {
  #boardContainer = null;

  #sortComponent = null;
  #listComponent = new ListView();
  #listEmptyComponent = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filtersModel = null;

  #points = [];
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #addNewPointPresenter = null;
  #newPointButtonComponent = null;
  #newPointButtonContainer = null;
  #pointPresenters = new Map();
  #isCreating;

  constructor({boardContainer, destinationsModel, offersModel, pointsModel, filterModel, newPointButtonContainer}) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filterModel;
    this.#newPointButtonContainer = newPointButtonContainer;
    this.#points = sort[this.#currentSortType](this.#pointsModel.points);
    this.#addNewPointPresenter = new AddNewPointPresenter ({
      container: this.#listComponent.element,
      onDataChange: this.#pointChangeHandler,
      onDestroy: this.#newPointDestroyHandler,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
    });
    this.#pointsModel.addObserver(this.#onModelEventHandler);
    this.#filtersModel.addObserver(this.#onModelEventHandler);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const filteredPoints = filter[this.#filterType](this.#points.points);
    return sort[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#newPointButtonComponent = new NewPointButtonView ({
      onClick: this.#newPointButtonClickHandler
    });
    render(this.#newPointButtonComponent, this.#newPointButtonContainer);
    this.#renderBoard();
  }

  #renderBoard = () => {
    if (this.#points.length === 0) {
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

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#pointsModel.points);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => this.#renderPoint(point));
  };

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

  #clearBoard = (resetSortType = false) => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#addNewPointPresenter.destroy();
    remove (this.#listEmptyComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

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

  #renderListContainer = () => {
    render(this.#listComponent, this.#boardContainer);
  };


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

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#addNewPointPresenter.destroy();
  };

  #onModelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
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
    this.#addNewPointPresenter.init();
  };

  #newPointDestroyHandler = (isCanseled) => {
    this.#isCreating = false;
    this.#newPointButtonComponent.setDisabled(false);
    if (isCanseled && this.#points.length === 0) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
  };
}
