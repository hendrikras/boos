import Veld from './Veld.js';

export default class Leeg extends Veld {
  constructor(x, y, dim) {
    super(x, y, dim);
    this.viewPort = {x: 36, y: 36};

    this.paths = ['M35 36H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h34c.55 0 1 .45 1 1v34c0 .55-.45 1-1 1z'
    , 'M1 36h34c.55 0 1-.45 1-1V1a.993.993 0 0 0-.294-.706L.294 35.706A.993.993 0 0 0 1 36z'
    , 'M2 2h32v32H2z'
    , 'M2 34V2h32z'
    , 'M17 2h2v32h-2z'
    , 'M2 19v-2h32v2z'
  ];

    this.colors2 = ['#e7edeb10', '#8ecece10', '#62a1c710', '#62a1c710', '#acd6f620', '#acd6f620', '#52a5de40', '#18284a40']
  }

  paint(p5) {
    p5.stroke('#00000000');
    this.paintShape(p5, this.paths, this.colors2, this.viewPort);
  }
}
