import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
import RoutePointView from '../view/route-point-view.js';
import { render } from '../render';

export default class BoardPresenter {
  listComponent = new ListView();

  constructor({boardContainer, destinationsModel, offersModel, pointsModel}) {
    this.boardContainer = boardContainer;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.get()];
    render(this.listComponent, this.boardContainer);

    render(
      new EditFormView ({
        point: this.points[0],
        pointDestinations: this.destinationsModel.get(),
        pointOffers: this.offersModel.get()
      }),
      this.listComponent.getElement()
    );

    this.points.forEach((point) => {
      render(
        new RoutePointView ({
          point,
          pointDestinations: this.destinationsModel.getById(point.destination),
          pointOffers: this.offersModel.getByType(point.type)
        }),
        this.listComponent.getElement()
      );
    });
  }
}
