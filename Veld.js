
import Punt from './Punt.js';
import { DRAW_SIZE, LEEG, DOOS, MENS, BOL, WAK } from './constants.js';

export default class Veld {
  constructor(x, y, dimensie) {
    this.startX = x;
    this.startY = y;
    this.tekenGrootte = DRAW_SIZE / dimensie.height;
    this.veldGrootte = this.tekenGrootte, (this.tekenGrootte - (this.tekenGrootte / dimensie.height));
    this.positie = new Punt(x, y);
    this.scherm = new Punt(x * this.veldGrootte, y * this.veldGrootte);
    this.typeVeld = LEEG;
  }

  isLeeg() {
    return this.typeVeld === LEEG;
  }

  isDoos() {
    return this.typeVeld === DOOS;
  }

  isMens() {
    return this.typeVeld === MENS;
  }

  isBol() {
    return this.typeVeld === BOL;
  }

  isWak() {
    return this.typeVeld === WAK;
  }
  
  verplaatsen(dx, dy) {
    this.positie.x += dx;
    this.positie.y += dy;
    this.scherm.x = this.positie.x * this.veldGrootte;
    this.scherm.y = this.positie.y * this.veldGrootte;
  }
  reset(dimensie, isDimPosition = false) {
    this.tekenGrootte = DRAW_SIZE / dimensie.height;
    this.veldGrootte = this.tekenGrootte, (this.tekenGrootte - (this.tekenGrootte / dimensie.height));

    if (isDimPosition) {
      this.positie.x = dimensie.width - 1;
      this.positie.y = dimensie.height - 1;
    } else {
      this.positie.x = this.startX;
      this.positie.y = this.startY;
    }

    this.scherm.x = this.positie.x * this.veldGrootte;
    this.scherm.y = this.positie.y * this.veldGrootte;
  }

  getCoordinates(command) {
    return { x: command[1], y: command[2] };
  }

  calcCoords(x, y, xp, yp) {
    const width = this.veldGrootte;
    const height = width;
    return { x: (x * width) / xp, y: (y * height) / yp };
  }

  paintShape(p5, paths, colors, vp) {
    const ctx = p5.drawingContext;
    const scaleX = this.veldGrootte / vp.x;
    const scaleY = this.veldGrootte / vp.y;
    ctx.setTransform(scaleX , 0, 0, scaleY , this.scherm.x , this.scherm.y);
    paths.forEach((element, index) => {
      const path = new Path2D(element);
      const color = colors.at(index);
      ctx.fillStyle = color;
      ctx.fill(path);
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
