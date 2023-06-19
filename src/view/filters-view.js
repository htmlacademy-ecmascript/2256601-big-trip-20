import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils/point-utils.js';

function createFilterItemTemplate (filter, currentFilterType) {
  const {type, count} = filter;
  return /*html*/(`
    <div class="trip-filters__filter">
      <input
      id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${type === currentFilterType ? 'checked' : ''}
      ${(count) ? '' : 'disabled'}/>
      <label class="trip-filters__filter-label"
      for="filter-${type}">${capitalize(type)}</label>
    </div>
  `);
}

function createFiltersTemplate (filters, currentFilterType) {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return (
    /*html*/`
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
    `
  );
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #onFilterTypeChange = null;
  constructor ({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterTypeChange(evt.target.value);
  };
}
