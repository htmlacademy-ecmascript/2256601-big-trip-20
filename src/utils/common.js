const isEscapeKey = (evt) => evt.key === 'Escape';

function getRandomInteger (min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

function getRandomValue (items) {
  return items[getRandomInteger(0, items.length - 1)];
}

export {isEscapeKey, getRandomInteger, getRandomValue};
