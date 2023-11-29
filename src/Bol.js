import Leeg from './Leeg.js';
import { BOL, FRAME_RATE } from './constants.js';

export default class Bol extends Leeg {
  constructor(x, y, dim) {
    super(x, y, dim);
    this.mond = false;
    this.count = 0;
    this.limit = FRAME_RATE / 2;
    this.vrij = true;
    this.dx = 0;
    this.typeVeld = BOL;
  }

  paint(p5) {
    super.paint(p5);
    if (this.count === this.limit) {
      this.mond = !this.mond;
      this.count = 0;
    }

    this.count += 1;
    let d = this.mond ? 0 : 20;

    // Draw the bol with the correct mouth
    p5.fill(255, 0, 0);
    const startAngle = this.scrn.objSz - this.scrn.detSzSm - d;
    const arcAngle = 300 + d + d;
    const x = this.scherm.x + this.scrn.vldSz / 2;
    const y = this.scherm.y + this.scrn.detSz * 2.5;
    p5.arc(x, y, this.scrn.objSz, this.scrn.objSz, p5.radians(startAngle), p5.radians(arcAngle));

    // Draw the eye
    p5.fill(255, 255, 255);
    p5.circle(this.scherm.x + this.scrn.detSz * 1.5, this.scherm.y + this.scrn.detSz * 1.5, this.scrn.detSz);
  }

  opblazen(p5) {
    if (this.dx > 300) return;

    this.dx += 10;
    let d = this.mond ? 0 : 20;
    if (this.vrij) p5.fill(255, 0, 0);
    else p5.fill(0, 0, 0);

    p5.arc(1, 1, 23 + this.dx, 23 + this.dx, 20 - d, 300 + d + d);
    p5.fill(255, 0, 0);
    p5.rect(12 + this.dx / 3, 4, this.dx / 3, this.dx / 3); // Eye
  }

  reset() {
    super.reset();
  }

  setVrij(vrij) {
    this.vrij = vrij;
  }
}
