import Veld from './Veld.js';
import { MENS } from './constants.js';

export default class Mens extends Veld {
  constructor(x, y, dim) {
    super(x, y, dim);
    this.typeVeld = MENS;
    // this.commands = this.getCommands(paths);
    this.paths = ['M36 18.5c0-1.639-.97-3.004-2.273-3.385C32.367 7.658 25.85 2 18 2C10.15 2 3.633 7.658 2.273 15.115C.97 15.496 0 16.861 0 18.5c0 1.736 1.087 3.168 2.51 3.442C4.269 28.868 10.527 34 18 34c7.473 0 13.731-5.132 15.49-12.058C34.912 21.668 36 20.236 36 18.5z'
      , 'M18 25c-3 0-4-1-4 1s2 4 4 4s4-2 4-4s-1-1-4-1z'
      , 'M18 26h2v1s0 1-1 1s-1-1-1-1v-1z'
      , 'M17.982 11h-.031a4.362 4.362 0 0 1-3.135-1.304a3.739 3.739 0 0 1-1.076-2.847a.992.992 0 0 1 1.057-.935c.551.033.972.508.939 1.06c-.029.495.155.983.503 1.336a2.425 2.425 0 0 0 1.725.729c.653-.036 1.27-.247 1.735-.705a3.312 3.312 0 0 0 .032-4.677a4.391 4.391 0 0 0-6.202-.042a.999.999 0 1 1-1.404-1.424a6.394 6.394 0 0 1 9.03.062a5.29 5.29 0 0 1-.052 7.486c-.836.826-1.945 1.261-3.121 1.261z'
    ];
    this.colors = ['#F7DECE', '#662113', '#FFF', '#dbc670'];
    this.viewPort = { x: 36, y: 36 }
  }

  paint(p5) {
    this.paintShape(p5, this.paths, this.colors, this.viewPort);

    p5.fill('#436580');
    const point = this.calcCoords(22.5, 18.5, this.viewPort.x, this.viewPort.y);
    const point2 = this.calcCoords(13.5, 18.5, this.viewPort.x, this.viewPort.y);
    const point3 = this.calcCoords(2.5, 2.5, this.viewPort.x, this.viewPort.y);
    p5.circle(this.scherm.x + point.x, this.scherm.y + point.y, point3.x);
    p5.circle(this.scherm.x + point2.x, this.scherm.y + point2.y, point3.y);
  }

}
