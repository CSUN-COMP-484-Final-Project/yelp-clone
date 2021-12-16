import { helper } from '@ember/component/helper';

// Helper to convert meters to miles
export function toMiles(positional /*, named*/) {
  const [meters] = positional;
  return (meters * 0.000621371).toFixed(2);
}

export default helper(toMiles);
