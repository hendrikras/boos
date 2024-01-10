import { DRAW_SIZE } from './constants.js';

const TEXT_SIZE = DRAW_SIZE / 13;

export default class Splash {
  constructor(wereld, hoofd, p5) {
    this.hoofd = hoofd;
    this.hoogte = p5.height;
    this.breedte = p5.width;
    this.p5 = p5;
    this.selectedY = 1;
    this.selectedX = 0;
    this.playerName = '';
    this.lineWidth = 0;
    this.totalLines = 0;
    this.alphabet = "abcdefghijklmnopqrstuvwxyz_⬅✔️";
    this.isMain = false;
    this.active = true;
    this.isScore = false;
  }

  updateName(char, remove = false) {
    if (!remove) {
      this.playerName += char;
    }
    this.printHeader('je naam:', this.playerName);
  }

  printHeader(left, right) {
    const levelBlock = this.p5.select('#level-block');
    levelBlock.html(left);
    const lifeBlock = this.p5.select('#life-block');
    lifeBlock.html(right);
  }

  paint() {
    this.p5.fill(255, 255, 255);
    this.p5.rect(0, 0, this.hoogte, this.breedte);
    this.p5.fill('#ffd9e5');
    this.p5.stroke(0);
    this.p5.strokeWeight(8);

    if (this.isMain) {
      this.p5.stroke(0x000000);

      // Now put something in the middle (more or less).
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      if (this.isScore) {
        this.printHeader('High', 'Score');
        this.hoofd.highscore.forEach((item, index) => {
          this.p5.textSize(TEXT_SIZE);
          this.drawButton(`${item.PlayerName} ${item.Score}`, index, false);
        });

      } else {
        this.p5.textSize(TEXT_SIZE);
        this.drawButton('Start', 1);
        this.drawButton('Kies Naam', 2);
        this.drawButton('High Score', 3);
        this.totalLines = 3;
      }

    } else {
      const SPACING = DRAW_SIZE / 6.5;;
      this.p5.textSize(SPACING);
      let x = 0;
      let y = SPACING;
      this.p5.background(0);
      this.totalLines = 0;
      for (let i = 0; i < this.alphabet.length; i++) {
        let char = this.alphabet[i];
        if (this.selectedX === i) {
          this.p5.textSize(SPACING + (TEXT_SIZE / 2));

          this.p5.fill('pink');
        } else {
          this.p5.textSize(SPACING);
          this.p5.fill('255')
        }
        this.p5.text(char, x + SPACING / 2, y);
        x += SPACING;

        if (x > this.breedte - SPACING) {
          this.totalLines++;
          if (this.lineWidth === 0) {
            this.lineWidth = i;
          }
          x = 0;
          y += SPACING;
        }
      }
    }
  }

  drawButton(label, index, drawFlake = true) {
    const x = this.breedte / 2;
    const y = this.hoogte / 2 - (this.hoogte / 3) + index * (this.hoogte / 12);
    const prefix = index === this.selectedY && drawFlake ? '❄️' : '';
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.text(`${prefix}${label}${prefix}`, x, y);
  }
  moveDown() {
    if (this.selectedY < this.totalLines) {
      this.selectedY++;
      this.selectedX += this.lineWidth + 1;
    }
  }
  moveUp() {
    if (this.selectedY > 1) {
      this.selectedY--;
      this.selectedX -= this.lineWidth + 1;
    }
  }
  moveRight() {
    const endLine = this.lineWidth * this.selectedY;
    if (this.selectedX < this.alphabet.length - 2 && this.selectedX < endLine + (this.selectedY - 1)) {
      this.selectedX++;
    }
  }
  moveLeft() {
    const modulo = this.lineWidth * (this.selectedY - 1 % this.lineWidth) + (this.selectedY - 1);
    if (this.selectedX > 0 && this.selectedX > modulo) {
      this.selectedX--;
    }
  }
  outOfBounds() {
    return this.selectedX > this.alphabet.length - 2 || this.selectedX < 0;
  }
  confirm() {
    if (this.outOfBounds()) {
      this.selectedX = 0;
      this.selectedY = 0;
    } else {
      if (this.isMain) {
        if (this.isScore) {
          this.isScore = false;
          this.selectedY = 1;
          this.selectedX = 0;
          return;
        }
        switch (this.selectedY) {
          case 1:
            this.active = false;
            this.hoofd.pause = false;
            break;
          case 2:
            this.selectedX = 0;
            this.selectedY = 0;
            this.isMain = false;
            break
          case 3:
            this.isScore = true;
            break;
          default:
            this.selectedY = 1;
        }
      } else {
        if (this.selectedX === this.alphabet.length - 2) {
          this.isMain = true;
          this.selectedY = 1;
          this.selectedX = 0;
        } else if (this.selectedX === this.alphabet.length - 3) {
          this.playerName = this.playerName.substring(0, this.playerName.length - 1);
          this.updateName(null, true);
        } else {
          if (this.playerName.length <= 10) {
            this.updateName(this.alphabet[this.selectedX]);
          }
        }
      }
    }
  }
}
