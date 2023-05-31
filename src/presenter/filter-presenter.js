import FiltersView from '../view/filters-view';
import { generateFiters } from '../mock/filter';
import { render } from '../framework/render.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filters = [];

  constructor ({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filters = generateFiters(this.#pointsModel.points);
  }

  init () {
    render(new FiltersView(this.#filters), this.#container);
  }
}

