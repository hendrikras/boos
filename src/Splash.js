export class Splash {
  constructor(wereld, hoofd, p5) {
    this.hoofd = hoofd;
    this.hoogte = p5.height;
    this.breedte = p5.width;
    this.p5 = p5;
  }

  paint() {
    this.p5.fill(255, 255, 255);
    this.p5.rect(0, 0, this.hoogte, this.breedte);

    this.p5.fill(255, 0, 0);

    this.p5.stroke(0x000000);

    // Now put something in the middle (more or less).
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.text("Game Over", this.breedte / 2, this.hoogte / 2 - (this.hoogte / 5));
    this.p5.text("Press any key to try again.", this.breedte / 2, this.hoogte / 2 - this.hoogte / 10);
    // this.p5.text("DIFFICULTY", this.breedte / 2, this.hoogte / 2);
    // this.p5.text("Set Name", this.breedte / 2, this.hoogte / 2 + this.hoogte / 5);
  }
}
