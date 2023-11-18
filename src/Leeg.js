import {Veld} from './Veld.js';

export class Leeg extends Veld {
  constructor(x, y, dim) {
    super(x, y, dim);
  }
  //...
  paint(p5) {
    p5.fill(255, 255, 255);
    super.paint(p5);
  }
}
