import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import TripInfoView from './view/trip-info-view.js';
import {render, RenderPosition} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';

import MockService from './service/mock-service.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/point-model.js';

const filtersMainElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const tripEventElement = document.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const boardPresenter = new BoardPresenter({
  boardContainer : tripEventElement,
  destinationsModel,
  offersModel,
  pointsModel
});

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersView(), filtersMainElement);
render(new SortView(), tripEventElement);

boardPresenter.init();
