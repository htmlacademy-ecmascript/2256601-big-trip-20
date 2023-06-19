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

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getTripTitle = (points, destinations) => {
  let firstDestinationTitle = 'Set the first waypoint.';
  let middleDestinationTitle = 'Set the second waypoint.';
  let endDestinationTitle = '';
  let tripTitle = 'Route not set.';

  switch (points.length) {
    case 0:
      break;
    case 1:
      firstDestinationTitle = destinations.find((el) => el.id === points[0].destination).name;

      tripTitle = `${firstDestinationTitle} — Add an endpoint`;
      break;
    case 2:
      firstDestinationTitle = destinations.find((el) => el.id === points[0].destination).name;
      middleDestinationTitle = destinations.find((el) => el.id === points[1].destination).name;

      tripTitle = `${firstDestinationTitle} — ${middleDestinationTitle}`;
      break;
    case 3:
      firstDestinationTitle = destinations.find((el) => el.id === points[0].destination).name;
      middleDestinationTitle = destinations.find((el) => el.id === points[1].destination).name;
      endDestinationTitle = destinations.find((el) => el.id === points[2].destination).name;

      tripTitle = `${firstDestinationTitle} — ${middleDestinationTitle} — ${endDestinationTitle}`;
      break;
    default:
      firstDestinationTitle = destinations.find((el) => el.id === points[0].destination).name;
      endDestinationTitle = destinations.find((el) => el.id === points[points.length - 1].destination).name;

      tripTitle = `${firstDestinationTitle} — … — ${endDestinationTitle}`;
  }
  return tripTitle;
};

export {isEscapeKey, getRandomInteger, getRandomValue, capitalize, getTripTitle};
