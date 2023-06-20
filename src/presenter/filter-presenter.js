import { render, replace, remove } from '../framework/render.js';
import TripFiltersView from '../view/trip-filters-view.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filtersModel = null;
  #tripModel = null;

  #filterComponent = null;

  constructor({ filterContainer, filtersModel, tripModel }) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#tripModel = tripModel;

    this.#tripModel.addObserver(this.#modelUpdateHandler);
    this.#filtersModel.addObserver(this.#modelUpdateHandler);
  }

  get filters() {
    const events = this.#tripModel.events;

    return Object.values(FilterType).map((type) => ({
      type,
      hasEvents: !!filter[type](events).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new TripFiltersView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#filterTypeChangeHandler
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #modelUpdateHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
