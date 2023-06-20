import { remove, render } from '../framework/render.js';
import { getTripTitle } from '../utils/common.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { compareEventPrice, compareEventDuration } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import TripSortView from '../view/trip-sort-view';
import EmptyListView from '../view/empty-list-view.js';
import EventListView from '../view/event-list-view.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import EventPresenter from './event-presenter.js';
import HeaderPresenter from './header-presenter.js';
import FilterPresenter from './filter-presenter.js';
import NewEventPresenter from './new-event-presenter.js';

export default class TripPresenter {
  #listContainer = null;
  #headerContainer = null;

  #offersModel = null;
  #eventsModel = null;
  #destinationsModel = null;
  #filtersModel = null;

  #sortComponent = null;
  #emptyListComponent = null;
  #listComponent = new EventListView();
  #newEventButtonComponent = new EventListView();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #isCreating = false;

  constructor({ listContainer, headerContainer, eventsModel, offersModel, destinationsModel, filtersModel }) {
    this.#listContainer = listContainer;
    this.#headerContainer = headerContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filtersModel = filtersModel;
    this.#newEventPresenter = new NewEventPresenter({
      destinations: this.#destinationsModel.destinations,
      options: this.#offersModel.offers,
      listComponent: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewEventFormClose
    });

    this.#eventsModel.addObserver(this.#handleModelUpdate);
    this.#filtersModel.addObserver(this.#handleModelUpdate);
  }

  init() {
    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderNewEventButton();
    this.#renderTrip();
  }

  get events() {
    this.#filterType = this.#filtersModel.filters;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SortType.TIME_DOWN:
        return filteredEvents.sort(compareEventDuration);
      case SortType.PRICE_DOWN:
        return filteredEvents.sort(compareEventPrice);
    }

    return filteredEvents;
  }

  createEvent() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #renderTrip() {
    if (this.events.length === 0 && !this.#isCreating) {
      this.#renderEmptyList();
    } else {
      this.#renderSort();
      render(this.#listComponent, this.#listContainer);
      this.events.forEach((event) => {
        this.#renderEvent(event);
      });
    }
  }

  #clearEventList({ resetSortType = false } = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    remove(this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
  }

  #renderTripInfo() {
    const headerPresenter = new HeaderPresenter({
      headerContainer: this.#headerContainer,
      tripTitle: getTripTitle(this.#eventsModel, this.#destinationsModel.destinations),
      tripDates: this.#eventsModel.getTripDates(),
      tripPrice: this.#eventsModel.getTotalPrice(),
    });

    headerPresenter.init();
  }

  #renderSort() {
    this.#sortComponent = new TripSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#listContainer);
  }

  #renderFilters() {
    const filterPresenter = new FilterPresenter({
      filterContainer: this.#headerContainer,
      filtersModel: this.#filtersModel,
      eventsModel: this.#eventsModel,
    });

    filterPresenter.init();
  }

  #renderNewEventButton() {
    this.#newEventButtonComponent = new NewEventButtonView({
      onClick: this.#handleNewEventButtonClick
    });

    render(this.#newEventButtonComponent, this.#headerContainer);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filterType
    });

    render(this.#emptyListComponent, this.#listContainer);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      listComponent: this.#listComponent.element,
      destinations: this.#destinationsModel.destinations,
      options: this.#offersModel.offers,
      onDataUpdate: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelUpdate = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventList();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearEventList({ resetSortType: true });
        this.#renderTrip();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderTrip();
  };

  #handleNewEventButtonClick = () => {
    this.#isCreating = true;
    this.createEvent();
    this.#newEventButtonComponent.element.disabled = true;
  };

  #handleNewEventFormClose = () => {
    this.#isCreating = false;
    this.#newEventButtonComponent.element.disabled = false;
  };
}
