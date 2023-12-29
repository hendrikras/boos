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
    this.alphabet = "abcdefghijklmnopqrstuvwxyz_⬅✔️";
    this.isMain = false;
    this.active = true;
  }

  updateName(char) {
    this.playerName += char;
    this.printPlayerName();
  }

  printPlayerName() {
    const levelBlock = this.p5.select('#level-block');
    levelBlock.html(`je naam:`);
    const lifeBlock = this.p5.select('#life-block');
    lifeBlock.html(this.playerName);
  }

  paint() {
    this.p5.fill(255, 255, 255);
    this.p5.rect(0, 0, this.hoogte, this.breedte);
    this.p5.textSize(32);
    this.p5.fill(255);
    this.p5.stroke(0);
    this.p5.strokeWeight(4);

    if (this.isMain) {
      this.p5.stroke(0x000000);

      // Now put something in the middle (more or less).
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);

      this.drawButton('Start', 1);
      this.drawButton('Kies Naam', 2);
      this.drawButton('High Score', 3);

    } else {
      const SPACING = 75
      this.p5.textSize(SPACING);
      let x = 0;
      let y = SPACING;
      this.p5.background(0);
      for (let i = 0; i < this.alphabet.length; i++) {
        let char = this.alphabet[i];
        if (this.selectedX === i) {
          this.p5.fill('yellow');
        } else {
          this.p5.fill('255')
        }
        this.p5.text(char, x + SPACING / 2, y);
        x += SPACING;

        if (x > this.breedte - SPACING) {
          if (this.lineWidth === 0) {
            this.lineWidth = i;
          }
          x = 0;
          y += SPACING;
        }
      }
    }
  }

  drawButton(label, index) {
    const x = this.breedte / 2;
    const y = this.hoogte / 2 - (this.hoogte / 3) + index * (this.hoogte / 10);
    const prefix = index === this.selectedY ? '❄️' : '';
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.text(`${prefix}${label}${prefix}`, x, y);
  }
  moveDown() {
    this.selectedY++;
    this.selectedX += this.lineWidth + 1;
  }
  moveUp() {
    this.selectedY--;
    this.selectedX -= this.lineWidth + 1;
  }
  moveRight() {
    this.selectedX++;
  }
  moveLeft() {
    this.selectedX--;
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
          this.printPlayerName();
        } else {
          if (this.playerName.length <= 10) {
            this.updateName(this.alphabet[this.selectedX]);
          }
        }
      }
    }
  }
}
