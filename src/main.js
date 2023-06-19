import BoardPresenter from './presenter/board-presenter.js';
import MockService from './service/mock-service.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/point-model.js';
import FiltersModel from './model/filters-model.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const mainElement = bodyElement.querySelector('.page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const filtersMainElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventElement = mainElement.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filtersModel = new FiltersModel();

const boardPresenter = new BoardPresenter({
  boardContainer : tripEventElement,
  headerContainer: tripMainElement,
  filterContainer: filtersMainElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel: filtersModel,
});

boardPresenter.init();
