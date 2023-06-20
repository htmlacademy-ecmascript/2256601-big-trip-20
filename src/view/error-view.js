import AbstractView from '../framework/view/abstract-view.js';

function createErrorTemplate() {
  return (/*html*/
    `<p class="trip-events__msg">Something went wrong. Please refresh the page after a while.</p>
    `);
}

export default class ErrorView extends AbstractView {
  get template() {
    return createErrorTemplate();
  }
}
