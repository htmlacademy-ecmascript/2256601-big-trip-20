import FiltersView from './view/filters-view.js';
import TripInfoView from './view/trip-inf-view.js';
import { render } from './render.js';
import { RenderPosition } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const filtersMainElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const tripEventElement = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({boardContainer : tripEventElement});

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersView(), filtersMainElement);

boardPresenter.init();
