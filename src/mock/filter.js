import { filter } from '../utils/filter-utils.js';

function generateFiters (points) {
  return Object.entries(filter)
    .map(([filterType, filterPoints]) => ({
      type: filterType,
      hasPoints: filterPoints(points).length > 0
    }));
}

export {generateFiters};
