import { Doos } from './Doos.js';
import { Leeg } from './Leeg.js';
import { Bol } from './Bol.js';
import { Mens } from './Mens.js';
import { Constants } from './constants.js';

export class Wereld {
  constructor(dimensie, hoofd) {
    this.dim = dimensie;
    this.hoofd = hoofd;
    this.updown = true;
    this.iLif = Constants.LIVES;
    this.bolDelay = 300;
    this.iLev = 1;
    this.einde = false;
    this.pause = false;
    this.count = 0;
    this.mens = new Mens(0, 0);
    this.reset();
  }

  reset() {
    this.stop();
    this.velden = new Array(this.dim.width).fill(null).map(() => new Array(this.dim.height).fill(new Leeg(0, 0, this.dim)));
    this.afstand = new Array(this.dim.width).fill(null).map(() => new Array(this.dim.height).fill(Infinity));
    this.tekenGrootte = Constants.DRAW_SIZE;

    for (let i = 0; i < this.dim.width; ++i) {
        for (let j = 0; j < this.dim.height; ++j) {
            if (Math.random() < 0.25) {
                this.velden[i][j] = new Doos(i, j);
            } else {
                this.velden[i][j] = new Leeg(i, j);
            }
        }
    }
    const x = this.mens.getX();
    const y = this.mens.getY();
    console.log('grave', this.velden[x][y]);
    // this.velden[x][y].verplaatsen(1, 1);
    // this.velden[x][y].verplaatsen(-1, -1);
    this.bol = new Bol(this.dim.width - 2, this.dim.height - 2);
    // this.mens.reset();
    debugger;
    this.velden[x][y].reset();
    console.log('mens', this.velden[x][y]);
    this.velden[0][0] = this.mens;

    this.velden[this.dim.width - 2][this.dim.height - 2] = this.bol;
    this.wissel = false;
    this.einde = false;
  }

  start(p5) {
    this.run(p5);
  }

  run(p5) {
    if (!this.einde && !this.pause) {
      this.action();
      this.paint(p5);
    }
  }

 action()    //  verwerk timer event
  {
      if( !this.einde )            //  bij einde geen actie
      {
          if( this.count === Constants.FRAME_RATE / 2 )        //  om en om
          {
              this.count = 0;
              this.resetAfstand( );
              this.bepaalAfstand( this.mens.getX( ), this.mens.getY( ), 1 );
              this.bol.setVrij( this.afstand[ this.bol.getX( ) ][ this.bol.getY( ) ] != Infinity );
              this.verplaatsBol( );
          }
          this.count += 1;
      }
  }

  stop() {
    this.einde = true;
  }

  paint(p5) {
    p5.background(255, 255, 255);
    p5.fill(0, 0, 255);
    let dimsiz = this.dim.height;
    let d = this.tekenGrootte * dimsiz;
    const offset = 10;
    // for (let i = this.tekenGrootte; i < d; i += this.tekenGrootte) {
    //   p5.line(i, offset, i, d); // vertical lines
    //   p5.line(offset, i, d, i); // horizontal lines
    // }

    for (let i = 0; i < dimsiz; i++) {
      for (let j = 0; j < dimsiz; j++) {
        this.velden[i][j].paint(p5);
      }
    }

    const levelBlock = p5.select('#level-block');
    levelBlock.html(`level: ${this.iLev}`);
    const lifeBlock = p5.select('#life-block');
    lifeBlock.html(`life: ${this.iLif}`)
    
    if (this.einde) {
      this.bol.opblazen(p5);
    }
  }

  resetAfstand() {
    for (let x = 0; x < this.dim.width; x++) {
      for (let y = 0; y < this.dim.height; y++) {
        this.afstand[x][y] = Infinity;
      }
    }
  }

  bepaalAfstand(x, y, n) {
    if (!this.isLegaal(x, y)) {
      return; // field is outside the world
    }

    if (this.afstand[x][y] !== Infinity) {
      return; // distance already determined
    }

    if (this.velden[x][y].isDoos()) {
      return; // field is a box
    }

    this.afstand[x][y] = n; // set the distance to the man

    this.bepaalAfstand(x + 1, y, n + 1); // to the right field
    this.bepaalAfstand(x, y + 1, n + 1); // to the bottom field
    this.bepaalAfstand(x - 1, y, n + 1); // to the left field
    this.bepaalAfstand(x, y - 1, n + 1); // to the top field
  }

  isLegaal(x, y) {
    return x >= 0 && y >= 0 && x < this.dim.width && y < this.dim.height;
  }

  verplaatsBol() {
    let x = this.bol.getX();
    let y = this.bol.getY();
    let af = []; // afstanden in 4 richtingen
    let min = 0;
  
    if (this.afstand[x][y] !== Infinity) {
      // agressieve zet mogelijk
      af[0] = this.isLegaal(x - 1, y) ? this.afstand[x - 1][y] : Infinity;
      af[1] = this.isLegaal(x, y - 1) ? this.afstand[x][y - 1] : Infinity;
      af[2] = this.isLegaal(x + 1, y) ? this.afstand[x + 1][y] : Infinity;
      af[3] = this.isLegaal(x, y + 1) ? this.afstand[x][y + 1] : Infinity;
    } else {
      // doe maar wat
      af[0] = this.isLegaal(x - 1, y) && this.velden[x - 1][y].isLeeg()
        ? this.dobbelsteen()
        : Infinity;
      af[1] = this.isLegaal(x, y - 1) && this.velden[x][y - 1].isLeeg()
        ? this.dobbelsteen()
        : Infinity;
      af[2] = this.isLegaal(x + 1, y) && this.velden[x + 1][y].isLeeg()
        ? this.dobbelsteen()
        : Infinity;
      af[3] = this.isLegaal(x, y + 1) && this.velden[x][y + 1].isLeeg()
        ? this.dobbelsteen()
        : Infinity;
    }
  
    for (let i = 1; i < 4; i++) {
      if (af[i] !== Infinity && af[i] < af[min]) {
        min = i; // kleinste afstand
      }
    }
  
    if (af[min] === Infinity) {
      // geen zet meer mogelijk !!
      // this.dim.height++;
      // this.dim.width++;
      this.iLev++;
      if (this.bolDelay !== 50) this.bolDelay -= 50;
      this.reset();
      return false;
    }
  
    let dx = 0;
    let dy = 0;
    switch (min) {
      case 0:
        dx = -1;
        break;
      case 1:
        dy = -1;
        break;
      case 2:
        dx = 1;
        break;
      case 3:
        dy = 1;
        break;
      case 5:
        console.log("ONVOORZIENE SITUATIE!!!");
        break;
    }
  
    // staat op de nieuwe positie soms de mens??
    if (this.velden[x + dx][y + dy].isMens()) {
      this.iLif--;

      if (this.iLif == 0) {
        this.hoofd.goMain(); // terug naar hoofdscherm
        this.bolDelay = 300;
        this.iLif = Constants.LIVES;
        this.dim.height = 10;
        this.dim.width = 10;
        this.iLev = 1;
      }
  
      this.reset();
    }

  
    this.bol.verplaatsen(dx, dy);
    this.velden[x + dx][y + dy] = this.bol;
    this.velden[x][y] = new Leeg(x, y, this.dim);
  
    return true;
  }

  dobbelsteen() {
    return this.dobbelsteen(1, 6); // random number between 1 and 6
  }

  dobbelsteen(min, max) {
    let die = Math.floor(Math.random() * (max - min + 1)) + min;
    return die;
  }

  verplaatsMens(dx, dy) {

    if (dx === 0 && dy === 0) return false; // no movement desired

    let x = this.mens.getX(); // current position
    let y = this.mens.getY();
    let nx = x + dx; // new position
    let ny = y + dy;
    if (!this.isLegaal(nx, ny)) return false; // movement not possible

    let rijDozen = false;
    while (this.velden[nx][ny].isDoos()) {
      rijDozen = true; // there is a row of boxes
      nx += dx;
      ny += dy;
      if (!this.isLegaal(nx, ny)) return false; // no movement
    }


    if (this.velden[nx][ny].isLeeg() && rijDozen) {
      this.velden[nx][ny] = new Doos(nx, ny, this.dim);
      this.velden[x + dx][y + dy] = new Leeg(x + dx, y + dy, this.dim);
    }

    if (this.velden[x + dx][y + dy].isLeeg()) {
      this.mens.verplaatsen(dx, dy);
      this.velden[x + dx][y + dy] = this.mens;
      this.velden[x][y] = new Leeg(x, y, this.dim);
    }

    return true;
  }

}
