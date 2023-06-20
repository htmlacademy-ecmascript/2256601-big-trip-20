import TripPresenter from './presenter/trip-presenter';
import TripModel from './model/trip-model';
import FiltersModel from './model/filters-model';
import TripApiService from './service/trip-api-service';
import { AUTHORIZATION, END_POINT } from './const';

const siteHeaderWrapper = document.querySelector('.trip-main');
const eventsListWrapper = document.querySelector('.trip-events');

const tripApiService = new TripApiService(END_POINT, AUTHORIZATION);
const tripModel = new TripModel({
  service: tripApiService
});
const filtersModel = new FiltersModel();

const tripPresenter = new TripPresenter({
  headerContainer: siteHeaderWrapper,
  listContainer: eventsListWrapper,
  tripModel,
  filtersModel
});

tripModel.init();
tripPresenter.init();
