import {Scrn} from './Scrn.js';
import Punt from './Punt.js';
import { DRAW_SIZE, LEEG, DOOS, MENS, BOL, SPOOK } from './constants.js';
import Snap from 'https://esm.sh/snapsvg';

export class Veld {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;
    this.tekenGrootte = DRAW_SIZE;
    this.scrn = new Scrn(this.tekenGrootte, (this.tekenGrootte - (this.tekenGrootte / 10)), this.tekenGrootte / 5, (this.tekenGrootte / 5) - 1);
    this.positie = new Punt(x, y);
    this.scherm = new Punt(x * this.scrn.vldSz, y * this.scrn.vldSz);
    this.typeVeld = LEEG;
    this.untouched = false;
  }

  getX() {
    return this.positie.x;
  }

  getY() {
    return this.positie.y;
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

  isSpook() {
    return this.typeVeld === SPOOK;
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

  getCoordinates(command) {
    return {x: command[1], y: command[2]};
  }

  calcCoords(x, y, xp, yp) {
    const width = this.scrn.vldSz;
    const height = width;
    return {x: (x * width) / xp, y: (y * height) / yp};
  }
  getCommands(pathData) {
    return Snap.path.toAbsolute(pathData);
  }
  paintShape(p5, commands, colors, vp){
  
    let prev = {x: 0, y: 0};
    let colorCount = 0;
    for (let i = 0; i < commands.length; i++) {
     
      let command = commands[i];
      const cmd = command && command[0];

      const rawCoords = this.getCoordinates(command);
      const coords = this.calcCoords(rawCoords.x, rawCoords.y, vp.x, vp.y);

      if (cmd === 'M' || cmd === 'L') {
        if (cmd === 'M'){
          p5.beginShape();
          p5.fill(colorCount >= colors.length -1 ? colors.at(-1) : colors.at(colorCount));
          colorCount +=1;
        }
        p5.vertex(this.scherm.x + coords.x, this.scherm.y + coords.y);
        prev = coords;
      }
     else if (cmd === 'H') {
       const x = coords.x;
       const y = prev.y
       p5.vertex(this.scherm.x + x, this.scherm.y + y);
       prev = {x, y};
     }
     else if (cmd === 'V') {
       const x = prev.x
       const y = coords.x;
       p5.vertex(this.scherm.x + x, this.scherm.y + y);
       prev = {x, y};
     }
     else if(cmd === 'C' || cmd === 'S' || cmd === 'Q'){
      const prevCommand = commands[i-1];
        const isCubic = cmd === 'C';
        const x1 = isCubic ? command[1] : prevCommand[3];
        const y1 = isCubic ? command[2] : prevCommand[4];
        const x2 = command[isCubic ? 3 : 1];
        const y2 = command[isCubic ? 4 : 2];
        const x3 = command[isCubic ? 5 : 3];
        const y3 = command[isCubic ? 6 : 4];
        const xy1 = this.calcCoords(x1, y1, vp.x, vp.y);
        const xy2 = this.calcCoords(x2, y2, vp.x, vp.y);
        const xy3 = this.calcCoords(x3, y3, vp.x, vp.y);
        cmd === 'Q' 
        ? p5.quadraticVertex(this.scherm.x + xy2.x, this.scherm.y + xy2.y , this.scherm.x + xy3.x, this.scherm.y + xy3.y)
        : p5.bezierVertex(this.scherm.x + xy1.x, this.scherm.y + xy1.y, this.scherm.x + xy2.x, this.scherm.y + xy2.y, this.scherm.x + xy3.x, this.scherm.y + xy3.y);
        prev = {x: xy3.x, y: xy3.y};
     }
      else if (cmd === 'A') {
        const rxy = this.calcCoords(command[1], command[2], vp.x, vp.y);
        const xAxisRotation = command[3];
        const largeArcFlag = command[4] === '1';
        const sweepFlag = command[5] === '1';
        const x = command[6];
        const y = command[7];
        const cc = this.calcCoords(x, y, vp.x, vp.y);
        p5.arc(this.scherm.x + cc.x, this.scherm.y + cc.yy, rxy.x, rxy.y, xAxisRotation, largeArcFlag, sweepFlag);
        prev={x: cc.x, y: cc.y};
      }
     else if (cmd === 'Z' || cmd === 'z') {
      p5.endShape(p5.CLOSE);
     }
    }
   
  }
   
  paint(p5) {
    if (this.untouched) return;
    // p5.rect(this.scherm.x + 1, this.scherm.y + 1, this.scrn.vldSz, this.scrn.vldSz);
  }
}
