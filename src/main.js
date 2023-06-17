import TripInfoView from './view/trip-info-view.js';
import {render, RenderPosition} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import MockService from './service/mock-service.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/point-model.js';
import FiltersModel from './model/filters-model.js';

const filtersMainElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const tripEventElement = document.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filtersModel = new FiltersModel();

const filterPresenter = new FilterPresenter ({
  container: filtersMainElement,
  pointsModel,
  filterModel: filtersModel,
});

const boardPresenter = new BoardPresenter({
  boardContainer : tripEventElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel: filtersModel,
});

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
boardPresenter.init();
