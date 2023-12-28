import Veld from './Veld.js';

export default class Leeg extends Veld {
  constructor(x, y, dim) {
    super(x, y, dim);
    this.viewPort = {x: 36, y: 36};
    const nums =  this.calcCoords(16, 164.696, this.viewPort, this.viewPort);
    this.p1 = nums.x;
    this.p2= nums.y;
    this.p3 = this.calcCoords(173.336, 0, this.viewPort, this.viewPort).x;
    const paths = 'M495.304,512H16.696C7.479,512,0,504.527,0,495.304V16.696C0,7.473,7.479,0,16.696,0h478.609C504.521,0,512,7.473,512,16.696v478.609C512,504.527,504.521,512,495.304,512z M495.304,0H256v512h239.304c9.217,0,16.696-7.473,16.696-16.696V16.696C512,7.473,504.521,0,495.304,0z M50.087,478.609h411.826c9.22,0,16.696-7.475,16.696-16.696V50.087c0-9.22-7.475-16.696-16.696-16.696H50.087c-9.22,0-16.696,7.475-16.696,16.696v411.826C33.391,471.133,40.867,478.609,50.087,478.609z';
    const path2 = 'M300.522,333.913h144.696V83.478c0-9.22-7.475-16.696-16.696-16.696h-128V333.913z M300.522,211.478H66.783v-128c0-9.22,7.475-16.696,16.696-16.696h217.043V211.478z M178.087,300.522h267.13v128c0,9.22-7.475,16.696-16.696,16.696H178.087V300.522z';
    const pathLast = 'M211.478,445.217h-128c-9.22,0-16.696-7.475-16.696-16.696V211.478h144.696V445.217z';
    const p1 = 'M21 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 6h-4v4h4v4h-4v4h-4v-4H8v4H4v-4h4v-4H4V8h4V4h4v4h4V4h4v4z';
    const p2 = 'M8 8h4v4H8zm4 4h4v4h-4z';

    const pa = 'M35 36H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h34c.55 0 1 .45 1 1v34c0 .55-.45 1-1 1z'
    + 'M1 36h34c.55 0 1-.45 1-1V1a.993.993 0 0 0-.294-.706L.294 35.706A.993.993 0 0 0 1 36z'
    + 'M2 2h32v32H2z'
    + 'M2 34V2h32z'
    + 'M17 2h2v32h-2z'
    + 'M2 19v-2h32v2z'
    ;
    // this.colors = ['#EACA7150', '#E1B76250', '#D8832990', '#CB6D2580'];
    // this.colors = ['#D2D1CD', '#A8A7A4', '#868683', '#6B6B69', '#565654', '#454543', '#373736', '#2C2C2B', '#232322', '#1C1C1B'];
    // this.colors2 = ['#E1B762', '#EACA71', '#EACA71', '#E1B762'];
    const snow = '#FFFFFF'; // White
    const frost = '#D9F3F1'; // Light Green
    const ice = '#ADD8E6'; // Light Blue
    const snowfall = '#E5E5E5'; // Light Gray
    const mist = '#D3D3D3'; // Smoke Gray
    const aurora = '#B0E0E6'; // Powder Blue

    this.colors = [aurora, frost, ice, snowfall, mist, snow];
    this.colors2 = ['#e7edeb10', '#8ecece10', '#62a1c710', '#62a1c710', '#acd6f620', '#acd6f620', '#52a5de40', '#18284a40']

    // create a random array

    this.commands = this.getCommands(pa);
  //   this.commands2 = this.getCommands(path2);
  //   this.commands3 = this.getCommands(pathLast);
  }

  paint(p5) {
    // super.paint(p5);
    p5.stroke('#00000000');
// p5.strokeCap(p5.PROJECT);
// p5.strokeJoin(p5.MITER);
// p5.strokeWeight(1)
// p5.strokeCap(p5.ROUND);
// p5.strokeJoin(p5.ROUND);
    this.paintShape(p5, this.commands, this.colors2, this.viewPort);
    // this.paintShape(p5, this.commands2, this.colors, this.viewPort);
    // this.paintShape(p5, this.commands3, this.colors2.slice().reverse(), this.viewPort);
  }
}
