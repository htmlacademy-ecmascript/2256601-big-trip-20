import TripPresenter from './presenter/trip-presenter';
import MockService from './service/mock-service';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import EventsModel from './model/events-model';
import FiltersModel from './model/filters-model';

const siteHeaderWrapper = document.querySelector('.trip-main');
const eventsListWrapper = document.querySelector('.trip-events');

const mockService = new MockService();
const eventsModel = new EventsModel(mockService);
const offersModel = new OffersModel(mockService);
const destinationsModel = new DestinationsModel(mockService);
const filtersModel = new FiltersModel();

const tripPresenter = new TripPresenter({
  headerContainer: siteHeaderWrapper,
  listContainer: eventsListWrapper,
  eventsModel,
  offersModel,
  destinationsModel,
  filtersModel
});


tripPresenter.init();
