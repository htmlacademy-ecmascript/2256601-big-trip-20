import { remove, render } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { SortType, UserAction, UpdateType, FilterType, TimeLimit } from '../const.js';
import { compareEventPrice, compareEventDuration, compareEventDate } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import TripSortView from '../view/trip-sort-view';
import EmptyListView from '../view/empty-list-view.js';
import EventListView from '../view/event-list-view.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import ErrorView from '../view/error-view.js';
import EventPresenter from './event-presenter.js';
import HeaderPresenter from './header-presenter.js';
import FilterPresenter from './filter-presenter.js';
import NewEventPresenter from './new-event-presenter.js';

export default class TripPresenter {
  #listContainer = null;
  #headerContainer = null;

  #tripModel = null;
  #filtersModel = null;

  #sortComponent = null;
  #emptyListComponent = null;
  #listComponent = new EventListView();
  #newEventButtonComponent = null;
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  #headerPresenter = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;

  #isCreating = false;
  #isLoading = true;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ listContainer, headerContainer, tripModel, filtersModel }) {
    this.#listContainer = listContainer;
    this.#headerContainer = headerContainer;
    this.#tripModel = tripModel;
    this.#filtersModel = filtersModel;
    this.#tripModel.addObserver(this.#modelUpdateHandler);
    this.#tripModel.addObserver(this.#newPresenterUpdateHandler);
    this.#tripModel.addObserver(this.#modelUpdateHeaderHandler);
    this.#filtersModel.addObserver(this.#modelUpdateHandler);
  }

  get events() {
    this.#filterType = this.#filtersModel.filters;
    const events = this.#tripModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredEvents.sort(compareEventDate);
      case SortType.TIME_DOWN:
        return filteredEvents.sort(compareEventDuration);
      case SortType.PRICE_DOWN:
        return filteredEvents.sort(compareEventPrice);
    }

    return filteredEvents;
  }

  get offers() {
    return this.#tripModel.offers;
  }

  get destinations() {
    return this.#tripModel.destinations;
  }

  init() {
    this.#renderFilters();
    this.#renderNewEventButton();
    this.#renderTripList();
  }

  createEvent() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #newPresenterUpdateHandler = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.#newEventPresenter = new NewEventPresenter({
        destinations: this.destinations,
        options: this.offers,
        listComponent: this.#listComponent.element,
        onDataChange: this.#viewActionHandler,
        onDestroy: this.#newEventFormCloseHandler
      });
    }
  };

  #clearHeader() {
    this.#headerPresenter.destroy();
  }

  #renderHeader() {
    this.#headerPresenter = new HeaderPresenter({
      headerContainer: this.#headerContainer,
      tripTitle: this.#tripModel.getTripTitle(),
      tripDates: this.#tripModel.getTripDates(),
      tripPrice: this.#tripModel.getTotalPrice(),
    });
    this.#headerPresenter.init();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#listContainer);
  }

  #renderError() {
    render(this.#errorComponent, this.#listContainer);
  }

  #renderTripList() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filterType
    });

    render(this.#emptyListComponent, this.#listContainer);
  }

  #renderSort() {
    this.#sortComponent = new TripSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    render(this.#sortComponent, this.#listContainer);
  }

  #renderFilters() {
    const filterPresenter = new FilterPresenter({
      filterContainer: this.#headerContainer,
      filtersModel: this.#filtersModel,
      tripModel: this.#tripModel,
    });

    filterPresenter.init();
  }

  #renderNewEventButton() {
    this.#newEventButtonComponent = new NewEventButtonView({
      onClick: this.#newEventButtonClickHandler
    });

    render(this.#newEventButtonComponent, this.#headerContainer);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      listComponent: this.#listComponent.element,
      destinations: this.destinations,
      options: this.offers,
      onDataUpdate: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler,
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#tripModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#tripModel.addEvent(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#tripModel.deleteEvent(updateType, update);
        } catch {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelUpdateHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventList();
        this.#renderTripList();
        break;
      case UpdateType.MAJOR:
        this.#clearEventList({ resetSortType: true });
        this.#renderTripList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTripList();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#newEventButtonComponent);
        this.#renderError();
        break;
    }
  };

  #modelUpdateHeaderHandler = () => {
    if (this.#headerPresenter) {
      this.#clearHeader();
    }
    this.#renderHeader();
  };

  #modeChangeHandler = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderTripList();
  };

  #newEventButtonClickHandler = () => {
    this.#isCreating = true;
    this.createEvent();
    this.#newEventButtonComponent.element.disabled = true;
  };

  #newEventFormCloseHandler = () => {
    this.#isCreating = false;
    this.#newEventButtonComponent.element.disabled = false;
  };
}
