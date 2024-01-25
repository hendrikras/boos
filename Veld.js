import Scrn from './Scrn.js';
import Punt from './Punt.js';
import { DRAW_SIZE, LEEG, DOOS, MENS, BOL } from './constants.js';
import Snap from 'https://esm.sh/snapsvg';

export default class Veld {
  constructor(x, y, dimensie) {
    this.startX = x;
    this.startY = y;
    this.tekenGrootte = DRAW_SIZE / dimensie.height;
    this.scrn = new Scrn(this.tekenGrootte, (this.tekenGrootte - (this.tekenGrootte / dimensie.height)), this.tekenGrootte / (dimensie.width / 2), (this.tekenGrootte / (dimensie.width / 2)) - 1);
    this.positie = new Punt(x, y);
    this.scherm = new Punt(x * this.scrn.vldSz, y * this.scrn.vldSz);
    this.typeVeld = LEEG;
    this.untouched = false;
  }

  getX() {
    return this.positie.x;
  }

  getY() {
    return this.positie.y;
  }

  isLeeg() {
    return this.typeVeld === LEEG;
  }

  isDoos() {
    return this.typeVeld === DOOS;
  }

  isMens() {
    return this.typeVeld === MENS;
  }

  isBol() {
    return this.typeVeld === BOL;
  }

  isSpook() {
    return this.typeVeld === SPOOK;
  }
  verplaatsen(dx, dy) {
    this.positie.x += dx;
    this.positie.y += dy;
    this.scherm.x = this.positie.x * this.scrn.vldSz;
    this.scherm.y = this.positie.y * this.scrn.vldSz;
  }
  reset(dimensie, isDimPosition = false) {
    this.tekenGrootte = DRAW_SIZE / dimensie.height;
    this.scrn = new Scrn(this.tekenGrootte, (this.tekenGrootte - (this.tekenGrootte / dimensie.height)), this.tekenGrootte / (dimensie.width / 2), (this.tekenGrootte / (dimensie.width / 2)) - 1);

    if (isDimPosition){
      this.positie.x = dimensie.width - 1;
      this.positie.y = dimensie.height - 1;
    } else {
      this.positie.x = this.startX;
      this.positie.y = this.startY;
    }

    this.scherm.x = this.positie.x * this.scrn.vldSz;
    this.scherm.y = this.positie.y * this.scrn.vldSz;
  }

  getCoordinates(command) {
    return { x: command[1], y: command[2] };
  }

  calcCoords(x, y, xp, yp) {
    const width = this.scrn.vldSz;
    const height = width;
    return { x: (x * width) / xp, y: (y * height) / yp };
  }
  getCommands(pathData) {
    return Snap.path.toAbsolute(pathData);
  }
  paintShape(p5, commands, colors, vp) {

    let prev = { x: 0, y: 0 };
    let colorCount = 0;
    for (let i = 0; i < commands.length; i++) {

      let command = commands[i];
      const cmd = command && command[0];

      const rawCoords = this.getCoordinates(command);
      const coords = this.calcCoords(rawCoords.x, rawCoords.y, vp.x, vp.y);

      if (cmd === 'M' || cmd === 'L') {
        if (cmd === 'M') {
          p5.beginShape();
          p5.fill(colorCount >= colors.length - 1 ? colors.at(-1) : colors.at(colorCount));
          colorCount += 1;
        }
        p5.vertex(this.scherm.x + coords.x, this.scherm.y + coords.y);
        prev = coords;
      }
      else if (cmd === 'H' || cmd === 'V') {
        const isHorizontal = cmd === 'H';
        const x = isHorizontal ? coords.x : prev.x;
        const y = isHorizontal ? prev.y : coords.x;
        p5.vertex(this.scherm.x + x, this.scherm.y + y);
        prev = { x, y };
      }
      else if (cmd === 'C' || cmd === 'S' || cmd === 'Q') {
        const prevCommand = commands[i - 1];
        const isCubic = cmd === 'C';
        const isSmooth = cmd === 'S';
        let x1 = command[1];
        let y1 = command[2];
        if (isSmooth) {
          const px = prevCommand.at(-4);
          const py = prevCommand.at(-3);
          const p = { x: prevCommand.at(-2), y: prevCommand.at(-1) };
          const res = this.reflectPoint({ x: px, y: py }, p);
          x1 = res.x;
          y1 = res.y;
        }
        const x2 = command[isCubic ? 3 : 1];
        const y2 = command[isCubic ? 4 : 2];
        const x3 = command[isCubic ? 5 : 3];
        const y3 = command[isCubic ? 6 : 4];
        const xy1 = this.calcCoords(x1, y1, vp.x, vp.y);
        const xy2 = this.calcCoords(x2, y2, vp.x, vp.y);
        const xy3 = this.calcCoords(x3, y3, vp.x, vp.y);

        cmd === 'Q'
          ? p5.quadraticVertex(this.scherm.x + xy2.x, this.scherm.y + xy2.y, this.scherm.x + xy3.x, this.scherm.y + xy3.y)
          : p5.bezierVertex(this.scherm.x + xy1.x, this.scherm.y + xy1.y, this.scherm.x + xy2.x, this.scherm.y + xy2.y, this.scherm.x + xy3.x, this.scherm.y + xy3.y);
        prev = { x: xy3.x, y: xy3.y };
      }
      else if (cmd === 'A') {
        const start = { ...prev };
        const end = { x: command.at(-2), y: command.at(-1) };

        const xAxisRotation = parseFloat(command.at(3));
        const largeArcFlag = command.at(4) === 1;
        const sweepFlag = command.at(5) === 1;

        const points = this.getCirclePoints(start, end, 10, command.at(1), command.at(2), largeArcFlag, sweepFlag, xAxisRotation);

        points.forEach((point) =>  {
          const p = this.calcCoords(point.x, point.y, vp.x, vp.y);
          p5.vertex(this.scherm.x + p.x, this.scherm.y + p.y);
        });

        const p2 = this.calcCoords(end.x, end.y, vp.x, vp.y);
        p5.vertex(this.scherm.x + p2.x, this.scherm.y + p2.y);

        prev = end;
      }
      else if (cmd === 'Z') {
        p5.endShape(p5.CLOSE);
      }
    }

  }
  getReflectionLine(p1, p2) {
    if (p1.x === p2.x) {
      return [{ x: p1.x, y: p1.y - 1 }, { x: p2.x, y: p2.y + 1 }];
    }
    if (p1.y === p2.y) {
      return [{ x: p1.x - 1, y: p1.y }, { x: p2.x + 1, y: p2.y }]
    }
    return [p1, p2];
  }

  reflectPoint = (p, q) => {
    const Xdistance = p.x - q.x;
    const Ydistance = p.y - q.y;
    return { x: q.x - Xdistance, y: q.y - Ydistance };
  };

  degreesToRadians = (degree) => {
    return (degree * Math.PI) / 180;
  };


  calculateCenter(point1, point2, radius) {
    let radsq = radius * radius;
    let q = Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2));
    let x3 = (point1.x + point2.x) / 2;
    let y3 = (point1.y + point2.y) / 2;

    let centerX = x3 + Math.sqrt(radsq - Math.pow(q / 2, 2)) * ((point1.y - point2.y) / q);
    let centerY = y3 + Math.sqrt(radsq - Math.pow(q / 2, 2)) * ((point2.x - point1.x) / q);

    return { x: centerX, y: centerY };
  }

  getAngle(center, point) {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    let theta = Math.atan2(dy, dx);
    return theta;
  }

  getCirclePoints(start, end, n, rx, ry, largeArcFlag, sweepFlag) {
    const center = this.calculateCenter(start, end, rx, ry);
    let startAngle = this.getAngle(center, end);
    let endAngle = this.getAngle(center, start);

    // Swap startAngle and endAngle based on sweepFlag
    if (!sweepFlag) {
      const temp = startAngle;
      startAngle = endAngle;
      endAngle = temp;
    }

    // If largeArcFlag is false, swap startAngle and endAngle again
    if (!largeArcFlag) {
      const temp = startAngle;
      startAngle = endAngle;
      endAngle = temp;
    }

    function generatePoints(theta, points) {
      const x = center.x + rx * Math.cos(theta);
      const y = center.y + ry * Math.sin(theta);
      theta += (2 * Math.PI) / n;

      if (theta <= endAngle) {
        points.push({ x: x, y: y });
        return generatePoints(theta, points);
      } else {
        return points;
      }
    }

    return generatePoints(startAngle, []);
  }

  paint(p5) {
    if (this.untouched) return;
  }
}
