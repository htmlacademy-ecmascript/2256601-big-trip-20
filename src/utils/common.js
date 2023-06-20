function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomPositiveInteger(min = 0, max = 1) {
  const lower = Math.abs(Math.min(min, max));
  const upper = Math.abs(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const getTripTitle = (events, destinations) => {
  let firstDestinationTitle = 'Set the first waypoint.';
  let middleDestinationTitle = 'Set the second waypoint.';
  let endDestinationTitle = '';
  let tripTitle = 'Route not set.';
  //Мне не очень нравится, что я тут передаю параметр, а потом обращаюсь к его заведомо известному свойству. Сделать деструктуризацию что ли перед всем?
  switch (events.events.length) {
    case 0:
      break;
    case 1:
      firstDestinationTitle = destinations.find((point) => point.id === events.events[0].destination).name;

      tripTitle = `${firstDestinationTitle} — Add an endpoint`;
      break;
    case 2:
      firstDestinationTitle = destinations.find((point) => point.id === events.events[0].destination).name;
      middleDestinationTitle = destinations.find((point) => point.id === events.events[1].destination).name;

      tripTitle = `${firstDestinationTitle} — ${middleDestinationTitle}`;
      break;
    case 3:
      firstDestinationTitle = destinations.find((point) => point.id === events.events[0].destination).name;
      middleDestinationTitle = destinations.find((point) => point.id === events.events[1].destination).name;
      endDestinationTitle = destinations.find((point) => point.id === events.events[2].destination).name;

      tripTitle = `${firstDestinationTitle} — ${middleDestinationTitle} — ${endDestinationTitle}`;
      break;
    default:
      firstDestinationTitle = destinations.find((point) => point.id === events.events[0].destination).name;
      endDestinationTitle = destinations.find((point) => point.id === events.events[events.events.length - 1].destination).name;

      tripTitle = `${firstDestinationTitle} — … — ${endDestinationTitle}`;
  }
  return tripTitle;
};

export {
  getRandomArrayElement,
  getRandomPositiveInteger,
  capitalizeFirstLetter,
  getTripTitle
};
