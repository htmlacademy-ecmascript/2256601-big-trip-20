import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FiltersModel extends Observable {
  #filters = FilterType.EVERYTHING;

  get filters() {
    return this.#filters;
  }

  setFilter(updateType, filter) {
    this.#filters = filter;
    this._notify(updateType, filter);
  }
}
