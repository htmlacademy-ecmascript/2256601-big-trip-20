import Observable from '../framework/observable.js';
import { FilterType } from '../const';

export default class FiltersModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter () {
    return this.#filter;
  }

  setFilter(UpdateType, filter) {
    this.#filter = filter;
    this._notify(UpdateType, filter);
  }
}
