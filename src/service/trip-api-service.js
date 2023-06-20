import ApiService from '../framework/api-service.js';
import { Method, SourceUrl } from '../const.js';

export default class TripApiService extends ApiService {
  getEvents() {
    return this._load({ url: SourceUrl.EVENTS })
      .then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({ url: SourceUrl.OFFERS })
      .then(ApiService.parseResponse);
  }

  getDestinations() {
    return this._load({ url: SourceUrl.DESTINATIONS })
      .then(ApiService.parseResponse);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `${SourceUrl.EVENTS}/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addEvent(event) {
    const response = await this._load({
      url: SourceUrl.EVENTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deleteEvent(event) {
    const response = await this._load({
      url: `${SourceUrl.EVENTS}/${event.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(event) {
    const adaptedEvent = {
      ...event,
      'date_from': event.dateFrom instanceof Date ? event.dateFrom.toISOString() : null,
      'date_to': event.dateTo instanceof Date ? event.dateTo.toISOString() : null,
      'base_price': event.basePrice,
      'is_favorite': event.isFavorite,
    };

    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.basePrice;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
