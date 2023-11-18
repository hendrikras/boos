import {Veld} from './Veld.js';
import {Constants} from './constants.js';

export class Mens extends Veld {
  constructor(x, y, dim) {
    super(x, y, dim);
    this.typeVeld = Constants.MENS;
  }

  paint(p5) {
    const schermx = this.scherm.x;
    const schermy = this.scherm.y;

    // Head
    p5.fill(255, 153, 51);
    p5.rect(schermx + 1, schermy + 1, this.scrn.objSz, this.scrn.objSz);

    // Eyes
    p5.fill(0, 0, 0);
    p5.rect(schermx + this.scrn.detSz, schermy + this.scrn.detSz + this.scrn.detSzSm, this.scrn.detSz, this.scrn.detSz);
    p5.rect(schermx + this.scrn.detSz * 3, schermy + this.scrn.detSz + this.scrn.detSzSm, this.scrn.detSz, this.scrn.detSz);

    // Nose
    p5.line(schermx + this.scrn.vldSz / 2, schermy + this.scrn.detSz + this.scrn.detSzSm, schermx + this.scrn.vldSz / 2, schermy + this.scrn.vldSz - this.scrn.detSz);
    p5.line(schermx + this.scrn.vldSz / 2, schermy + this.scrn.vldSz - this.scrn.detSz, schermx + this.scrn.objSz - this.scrn.detSz, schermy + this.scrn.vldSz - this.scrn.detSz);
  }

  // const x = this.scherm.x;
  // const y = this.scherm.y;
  // p5.fill(255, 165, 0); // Set fill color to orange
  // p5.ellipse(x + this.scrn.detSz * 2, y + this.scrn.detSz * 2, this.scrn.detSz * 3, this.scrn.detSz * 3);

  // p5.fill(255); // Set fill color to white
  // p5.ellipse(x + 16, y + 18, 5, 5);
  // p5.ellipse(x + 27, y + 18, 5, 5);

  // p5.fill(0); // Set fill color to black
  // p5.ellipse(x + 19, y + 20, 2, 2);
  // p5.ellipse(x + 28, y + 20, 2, 2);

  // p5.stroke(0); // Set stroke color to black
  // p5.line(x + 24, y + 20, x + 24, y + 30);
  // p5.line(x + 24, y + 30, x + 27, y + 30);
  // }
}
