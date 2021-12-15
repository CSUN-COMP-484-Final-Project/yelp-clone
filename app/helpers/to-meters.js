import { helper } from '@ember/component/helper';

export function toMeters(positional /*, named*/) {
  const [miles] = positional;
  return (miles / 0.000621371).toFixed();
}
export default helper(toMeters);
