import {Veld} from './Veld.js';
import {Constants} from './constants.js';

export class Doos extends Veld {
  constructor(x, y, dim) {
    super(x, y, dim);
    this.typeVeld = Constants.DOOS;
  }

  paint(p5) {
    p5.fill(222,184,135);
    p5.rect(this.scherm.x + 1, this.scherm.y + 1, this.scrn.vldSz - 1, this.scrn.vldSz - 1);
  }
}
