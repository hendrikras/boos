import Doos from './Doos.js';
import Leeg from './Leeg.js';
import Bol from './Bol.js';
import Mens from './Mens.js';
import Wak from './Wak.js';
import { DRAW_SIZE, FRAME_RATE, LIVES } from './constants.js';

export default class Wereld {
  constructor(dimensie, hoofd) {
    this.dim = dimensie;
    this.hoofd = hoofd;
    this.updown = true;
    this.iLif = LIVES;
    this.bolDelay = FRAME_RATE / 2;
    this.iLev = 1;
    this.einde = false;
    this.pause = false;
    this.count = 0;
    this.mens = new Mens(0, 0, this.dim);
    this.bol = new Bol(this.dim.width - 1, this.dim.height - 1, this.dim);
    this.moves = 0;
    this.reset();
  }

  reset() {
    this.stop();
    this.velden = Array.from({ length: this.dim.width }, (_, widthIndex) =>
      Array.from({ length: this.dim.height }, (_, heightIndex) => {
        if (widthIndex === 0 && heightIndex === 0) {
          return this.mens;
        } else if (heightIndex === this.dim.height && widthIndex === this.dim.width) {
          return this.bol;
        }
        if (Math.random() < 0.25) {
          return new Doos(widthIndex, heightIndex, this.dim);
        }
        return new Leeg(widthIndex, heightIndex, this.dim)
      })
    );

    this.afstand = new Array(this.dim.width).fill(null).map(() => new Array(this.dim.height).fill(Infinity));
    this.tekenGrootte = DRAW_SIZE / this.dim.height;
    const x = this.mens.getX();
    const y = this.mens.getY();
    this.velden[x][y] = new Wak(x, y, this.dim);

    this.mens.reset(this.dim);
    this.velden[0][0] = this.mens;

    this.bol.reset(this.dim);
    this.velden[0][0] = this.mens;
    this.wissel = false;
    this.einde = false;
  }

  start(p5) {
    const levelBlock = p5?.select('#level-block');
    if (levelBlock) {
      levelBlock.html(`level: ${this.iLev}`);
      const lifeBlock = p5.select('#life-block');
      let lifstr = '';

      for (let i = 0; i < this.iLif; i++) {
        lifstr = `${lifstr}❤️`;
      }
      lifeBlock.html(lifstr)
      this.run(p5);
    } else {
      this.hoofd.splash.active = true;
      this.hoofd.splash.selectedY = 1;
    }
  }

  run(p5) {
    if (!this.einde && !this.pause) {
      this.action();
      this.paint(p5);
    }
  }

  action()    //  verwerk timer event
  {
    if (!this.einde)            //  bij einde geen actie
    {
      if (this.count === this.bolDelay)        //  om en om
      {
        this.count = 0;
        this.resetAfstand();
        this.bepaalAfstand(this.mens.getX(), this.mens.getY(), 1);
        this.bol.setVrij(this.afstand[this.bol.getX()][this.bol.getY()] != Infinity);
        this.verplaatsBol();
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
    let dimsiz = this.dim.height
    for (let i = 0; i < dimsiz; i++) {
      for (let j = 0; j < dimsiz; j++) {
        this.velden[i][j].paint(p5);
      }
    }

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
      if (this.moves !== 0) {
        this.moves = 0;
        this.dim.height++;
        this.dim.width++;
        this.iLev++;
        if (this.bolDelay !== 1) {
          this.bolDelay--;
        }
      }
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
        console.error("ONVOORZIENE SITUATIE!!!");
        break;
    }

    // staat op de nieuwe positie soms de mens??
    const isMens = this.velden[x + dx][y + dy].isMens();
    if (isMens) {
      this.iLif--;

      if (this.iLif == 0) {
        this.hoofd.goMain(this.iLev); // terug naar hoofdscherm
        this.bolDelay = FRAME_RATE / 2;
        this.iLif = LIVES;
        this.dim.height = 10;
        this.dim.width = 10;
        this.iLev = 1;
      }

      this.reset();
    }


    this.bol.verplaatsen(dx, dy);
    this.velden[x + dx][y + dy] = isMens ? new Wak(x + dx, y + dy, this.dim) : this.bol;
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
    this.moves += 1;

    if (dx === 0 && dy === 0) return false; // no movement desired

    let x = this.mens.getX(); // current position
    let y = this.mens.getY();
    let nx = x + dx; // new position
    let ny = y + dy;
    const magDat = this.isLegaal(nx, ny)

    if (!magDat) return false; // movement not possible

    let rijDozen = false;
    while (this.velden[nx][ny].isDoos()) {
      rijDozen = true; // there is a row of boxes
      nx += dx;
      ny += dy;
      const isLegit = this.isLegaal(nx, ny);
      if (!isLegit) return false; // no movement
    }


    if (this.velden[nx][ny].isLeeg() && rijDozen) {
      this.velden[nx][ny] = new Doos(nx, ny, this.dim);
      this.velden[x + dx][y + dy] = new Leeg(x + dx, y + dy, this.dim);
    }

    if (this.velden[x + dx][y + dy].isLeeg()) {
      this.mens.verplaatsen(dx, dy, this.dim);
      this.velden[x + dx][y + dy] = this.mens;
      this.velden[x][y] = new Leeg(x, y, this.dim);
    }

    return true;
  }

}
