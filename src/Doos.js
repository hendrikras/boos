import {Veld} from './Veld.js';
import {DOOS} from './constants.js';

export default class Doos extends Veld {
  constructor(x, y, dim) {
    super(x, y, dim);
    this.typeVeld = DOOS;
    const path = 'M12,0h-2H0v48v2v10h48h2h10V12v-2V0H12z M46,12h2v36h-2V12z M44,48h-8V12h8V48z M34,48h-8V12h8V48z M24,48h-8V12h8V48z M14,48h-2V12h2V48z M2,2h8v10v36H9v-1c0-0.553-0.447-1-1-1s-1,0.447-1,1v1H6v-7c0-0.553-0.447-1-1-1s-1,0.447-1,1v7H2V2z M2,58v-8h10h2h10h2h8h2h10h2v2h-5c-0.553,0-1,0.447-1,1s0.447,1,1,1h5v1h-3c-0.553,0-1,0.447-1,1s0.447,1,1,1h3v1H2z M58,58h-8V48V12h2v5c0,0.553,0.447,1,1,1s1-0.447,1-1v-5h1v3c0,0.553,0.447,1,1,1s1-0.447,1-1v-3h1V58z M48,10h-2H36h-2h-8h-2H14h-2V9h2c0.553,0,1-0.447,1-1s-0.447-1-1-1h-2V6h3c0.553,0,1-0.447,1-1s-0.447-1-1-1h-3V2h46v8H48z';
    this.commands = this.getCommands(path);
  }

  paint(p5) {
    p5.fill(222,184,135);     
    this.paintShape(p5, this.commands, ['#E6B887', '#E6B887', '#8b6914'], {x: 60, y: 60}) ;
  }
}
