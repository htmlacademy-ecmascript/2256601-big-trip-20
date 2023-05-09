import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
import RoutePointView from '../view/route-point-view.js';
import SortsView from '../view/sort-view.js';
import { render } from '../render';

export default class BoardPresenter {
  listComponent = new ListView();
  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortsView(), this.boardContainer);
    render(this.listComponent, this.boardContainer);
    render(new EditFormView(), this.listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.listComponent.getElement());
    }
  }
}
