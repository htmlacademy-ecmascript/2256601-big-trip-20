import FiltersView from '../view/filters-view';
import { render, replace, remove } from '../framework/render.js';
import { filter } from '../utils/filter-utils';
import { UpdateType, FilterType } from '../const';
export default class FilterPresenter {
  #filterContainer = null;
  #filtersModel = null;
  #pointsModel = null;
  #filterComponent;

  constructor ({filterContainer, filterModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#onModelEvent);
    this.#filtersModel.addObserver(this.#onModelEvent);
  }

  get getFilterData() {
    const points = this.#pointsModel.points;
    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points).length
    }));
  }

  init () {
    const filters = this.getFilterData;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#onFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #onModelEvent = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

