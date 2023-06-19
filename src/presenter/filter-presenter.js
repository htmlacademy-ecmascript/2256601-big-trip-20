import FiltersView from '../view/filters-view';
import { render, replace, remove } from '../framework/render.js';
import { filter } from '../utils/filter-utils';
import { UpdateType, FilterType } from '../const';
export default class FilterPresenter {
  #container = null;
  #filtersModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor ({container, filtersModel, pointsModel}) {
    this.#container = container;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#onModelEventHandler);
    this.#filtersModel.addObserver(this.#onModelEventHandler);
  }

  get filters() {
    const points = this.#pointsModel.points;
    return Object.values(FilterType).map((type) => ({
      type,
      count: !!filter[type](points).length
    }));
  }

  init () {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#onFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #onModelEventHandler = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

