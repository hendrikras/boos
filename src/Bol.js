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
    const path= ''
    +'M26.3 60.5c-.8 0-2.6.7-3.2.1c-.8-.8 0-4.6 0-4.6h-2.3s.8 3.8 0 4.6c-.6.5-2.4-.1-3.2-.1c-2 0-3.7 1.5-3.7 1.5h16c.1 0-1.5-1.5-3.6-1.5 Z'
    +'M46.3 60.5c-.8 0-2.6.7-3.2.1c-.8-.8 0-4.6 0-4.6h-2.3s.8 3.8 0 4.6c-.6.5-2.4-.1-3.2-.1c-2 0-3.7 1.5-3.7 1.5h16c.1 0-1.5-1.5-3.6-1.5 Z'
    +'M10.4 27C-.4 33.7 1.7 43 3.3 41.9C20 29.7 24.2 18.5 10.4 27z'
    +'M53.6 27c-13.8-8.5-9.6 2.7 7.1 14.9c1.6 1.1 3.7-8.2-7.1-14.9z'
    +'M48 17.5C48 8.9 40.8 2 32 2S16 8.9 16 17.5c0 11.6-4 15.5-4 23.2C12 51.3 21 60 32 60s20-8.7 20-19.3c0-7.7-4-11.6-4-23.2z'
    +'M44 18.8c0-12.4-10.1-10-10.1-.7h-3.7C30.1 8.8 20 6.4 20 18.8c0 9.7-4 15.7-4 22.1C16 52.5 23.7 58 32 58s16-5.6 16-17.1c0-6.4-4-12.4-4-22.1z'
    +'M41 17c0 1.7-.9 3-2 3s-2-1.3-2-3s.9-3 2-3s2 1.3 2 3z'
    +'M27 17c0 1.7-.9 3-2 3s-2-1.3-2-3s.9-3 2-3s2 1.3 2 3z'
    +'M28 22h8c0 2.5-1.8 4.6-4 4.6s-4-2-4-4.6z'
    +'M37 22.3l-5 1.2l-5-1.2c0-3.2 2.2-5.7 5-5.7s5 2.6 5 5.7z'
    +'M33.7 17.8c.3.3.4.7.3.9c-.1.2-.5 0-.8-.3c-.3-.3-.4-.7-.3-.9c.2-.1.6 0 .8.3z'
    +'M30.3 17.8c-.3.3-.4.7-.3.9c.1.2.5 0 .8-.3c.3-.3.4-.7.3-.9c-.2-.1-.6 0-.8.3z';

    // const path2 = 'M 10 10 L 40 10 Q 45 10 45 20 T 45 30 A 10 10 0 0 1 30 30 V 40 H 10 Z';

    this.colors =  ['#e08828', '#e08828', '#3e4347', '#3e4347',  '#3e4347', '#fff', '#3e4347', '#3e4347', '#e08828', '#f29a2e', '#3e4347'];

    this.commands = this.getCommands(path);
    this.viewPort = {x: 64, y: 64};
  }

  paint(p5) {
    // super.paint(p5);
    // if (this.count === this.limit) {
    //   this.mond = !this.mond;
    //   this.count = 0;
    // }

    // this.count += 1;
    // let d = this.mond ? 0 : 20;

    // // Draw the bol with the correct mouth
    // p5.fill(255, 0, 0);
    // const startAngle = this.scrn.objSz - this.scrn.detSzSm - d;
    // const arcAngle = 300 + d + d;
    // const x = this.scherm.x + this.scrn.vldSz / 2;
    // const y = this.scherm.y + this.scrn.detSz * 2.5;
    // p5.arc(x, y, this.scrn.objSz, this.scrn.objSz, p5.radians(startAngle), p5.radians(arcAngle));

    // // Draw the eye
    // p5.fill(255, 255, 255);
    // p5.circle(this.scherm.x + this.scrn.detSz * 1.5, this.scherm.y + this.scrn.detSz * 1.5, this.scrn.detSz);

    // this.paintShape(p5, this.commands, this.colors, this.viewPort);
    this.paintShape(p5, this.commands, this.colors, this.viewPort);
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

  // reset() {
  //   super.reset();
  // }

  setVrij(vrij) {
    this.vrij = vrij;
  }
}
