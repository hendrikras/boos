import Doos from './Doos.js';
import Leeg from './Leeg.js';
import Bol from './Bol.js';
import Mens from './Mens.js';
import Wak from './Wak.js';
import StopWatch from './StopWatch.js';
import Punt from './Punt.js';
import { DRAW_SIZE, FRAME_RATE, LIVES } from './constants.js';

export default class extends StopWatch {
  constructor(dimensie, hoofd) {
    super();
    this.dim = dimensie;
    this.hoofd = hoofd;
    this.updown = true;
    this.levens = LIVES;
    this.bolDelay = FRAME_RATE / 2;
    this.level = 1;
    this.einde = false;
    this.pause = false;
    this.count = 0;
    this.mens = new Mens(0, 0, this.dim);
    this.bol = new Bol(this.dim.width - 1, this.dim.height - 1, this.dim);
    this.moves = [];
    this.bolMoves = [];
    this.startTime = null;
    this.liveTimes = [];
    this.LevelStartPos = null;
    this.reset();
  }

  reset(wak) {
    this.velden = Array.from({ length: this.dim.width }, (_, widthIndex) =>
      Array.from({ length: this.dim.height }, (_, heightIndex) => {
        if (widthIndex === 0 && heightIndex === 0) {
          return this.mens;
        }
        if (heightIndex === this.dim.height - 1 && widthIndex === this.dim.width - 1) {
          return this.bol;
        }
        if (wak && heightIndex === wak.y && widthIndex === wak.x) {
          return new Wak(widthIndex, heightIndex, this.dim);
        }
        if (Math.random() < 0.25) {
          return new Doos(widthIndex, heightIndex, this.dim);
        }
        return new Leeg(widthIndex, heightIndex, this.dim);
      }));

    this.afstand = new Array(this.dim.width).fill(null).map(() => new Array(this.dim.height).fill(Infinity));
    this.tekenGrootte = DRAW_SIZE / this.dim.height;

    this.mens.reset(this.dim);
    this.velden[0][0] = this.mens;
    this.bol.reset(this.dim, true);
    this.wissel = false;
    this.einde = false;

    const levelCandidate = this.velden.map((array) => array.map(veld => veld.typeVeld));
    this.resetAfstand();
    this.bepaalAfstand(this.mens.positie.x, this.mens.positie.y, 1);
    this.moves = [];
    this.bolMoves = [];
    if (this.afstand[this.dim.height - 1][this.dim.width - 1] !== Infinity) {
      this.LevelStartPos = levelCandidate.flat();
    } else {
      this.reset(wak);
    }
  }

  start(p5) {
    const levelBlock = p5?.select('#level-block');
    if (levelBlock) {
      levelBlock.html(`level: ${this.level}`);
      const lifeBlock = p5.select('#life-block');
      let lifstr = '';

      for (let i = 0; i < this.levens; i++) {
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
      if (!this.startTime) {
        this.startTime = new Date();
      }
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
        this.bepaalAfstand(this.mens.positie.x, this.mens.positie.y, 1);
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
    const { x, y } = this.bol.positie;
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

    if (af[min] === Infinity && this.bolMoves.length > 0) {
      // geen zet meer mogelijk !!
      this.hoofd.progress.push({
        level: this.level,
        moves: this.moves,
        bolMoves: this.bolMoves,
        time: this.stopTimer(),
        levelStartPos: this.LevelStartPos
      });
      this.dim.height++;
      this.dim.width++;
      this.level++;
      this.startTime = null;
      if (this.bolDelay !== 1) {
        this.bolDelay--;
      } else {
        this.hoofd.goMain(this.liveTimes);
        this.liveTimes = [];
        this.bolDelay = FRAME_RATE / 2;
        this.levens = LIVES;
        this.dim.height = 10;
        this.dim.width = 10;
        this.level = 1;
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
      this.levens--;
      this.liveTimes.push(this.stopTimer());
      this.startTime = null;
      this.bolMoves = [];
      if (this.levens === 0) {
        this.hoofd.goMain(this.liveTimes); // terug naar hoofdscherm
        this.liveTimes = [];
        this.bolDelay = FRAME_RATE / 2;
        this.levens = LIVES;
        this.dim.height = 10;
        this.dim.width = 10;
        this.level = 1;
      }
      const pos = new Punt(x + dx, y + dy)

      this.reset(pos);
      return false;
    }

    this.bol.verplaatsen(dx, dy);
    this.bolMoves.push(min);
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

  direction(dx, dy) {
    if (dx === 1 && dy === 0) return 2; // right
    else if (dx === -1 && dy === 0) return 0; // left
    else if (dy === 1 && dx === 0) return 3; // down
    else if (dy === -1 && dx === 0) return 1; // up
    else { console.warn("Invalid direction") };
    return 4;
  }

  verplaatsMens(dx, dy) {
    if (dx === 0 && dy === 0) return false; // no movement desired

    const { x, y } = this.mens.positie;
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
      this.moves.push(this.direction(dx, dy));
      this.velden[x + dx][y + dy] = this.mens;
      this.velden[x][y] = new Leeg(x, y, this.dim);
    }

    return true;
  }

}
