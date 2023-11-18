import {Scrn} from './Scrn.js';
import {Punt} from './Punt.js';
import { Constants } from './constants.js';

export class Veld {
  constructor(x, y, dim) {
    this.startX = x;
    this.startY = y;
    this.tekenGrootte = Constants.DRAW_SIZE;
    this.scrn = new Scrn(this.tekenGrootte, (this.tekenGrootte - (this.tekenGrootte / 10)), this.tekenGrootte / 5, (this.tekenGrootte / 5) - 1);
    this.positie = new Punt(x, y);
    this.scherm = new Punt(x * this.scrn.vldSz, y * this.scrn.vldSz);
    this.typeVeld = Constants.LEEG;
    this.untouched = false;
  }

  getX() {
    return this.positie.x;
  }

  getY() {
    return this.positie.y;
  }

  isLeeg() {
    return this.typeVeld === Constants.LEEG;
  }

  isDoos() {
    return this.typeVeld === Constants.DOOS;
  }

  isMens() {
    return this.typeVeld === Constants.MENS;
  }

  isBol() {
    return this.typeVeld === Constants.BOL;
  }
  //...
  verplaatsen(dx, dy) {
    this.positie.x += dx;
    this.positie.y += dy;
    this.scherm.x = this.positie.x * this.scrn.vldSz;
    this.scherm.y = this.positie.y * this.scrn.vldSz;
  }
  reset(){
    this.positie.x = this.startX;
    this.positie.y = this.startY;
    this.scherm.x = this.positie.x * this.scrn.vldSz;
    this.scherm.y = this.positie.y * this.scrn.vldSz;
  }
  paint(p5) {
    if (this.untouched) return;
    p5.rect(this.scherm.x + 1, this.scherm.y + 1, this.scrn.objSz, this.scrn.objSz);
  }
}
