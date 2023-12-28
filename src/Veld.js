import Scrn from './Scrn.js';
import Punt from './Punt.js';
import { DRAW_SIZE, LEEG, DOOS, MENS, BOL, SPOOK } from './constants.js';
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
  //...
  verplaatsen(dx, dy) {
    // console.log("verplaatsen", this.scrn);
    this.positie.x += dx;
    this.positie.y += dy;
    this.scherm.x = this.positie.x * this.scrn.vldSz;
    this.scherm.y = this.positie.y * this.scrn.vldSz;
  }
  reset(dimensie) {
    this.tekenGrootte = DRAW_SIZE / dimensie.height;
    this.scrn = new Scrn(this.tekenGrootte, (this.tekenGrootte - (this.tekenGrootte / dimensie.height)), this.tekenGrootte / (dimensie.width / 2), (this.tekenGrootte / (dimensie.width / 2)) - 1);

    this.positie.x = this.startX;
    this.positie.y = this.startY;
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
        // debugger
        cmd === 'Q'
          ? p5.quadraticVertex(this.scherm.x + xy2.x, this.scherm.y + xy2.y, this.scherm.x + xy3.x, this.scherm.y + xy3.y)
          : p5.bezierVertex(this.scherm.x + xy1.x, this.scherm.y + xy1.y, this.scherm.x + xy2.x, this.scherm.y + xy2.y, this.scherm.x + xy3.x, this.scherm.y + xy3.y);
        prev = { x: xy3.x, y: xy3.y };
      }
      else if (cmd === 'A') {
        const start = {...prev};
        const end = {x: command.at(-2), y: command.at(-1)};

        const xAxisRotation = parseFloat(command.at(3));
        const largeArcFlag = command.at(4) === 1;
        const sweepFlag = command.at(5) === 1;

        const points = this.getCirclePoints(start, end, 10, command.at(1), command.at(2), largeArcFlag, sweepFlag, xAxisRotation);
        
        for (let point of points) {
          const p = this.calcCoords(point.x, point.y, vp.x, vp.y);
          p5.vertex(this.scherm.x + p.x, this.scherm.y + p.y);
        }

        const p2 = this.calcCoords(end.x, end.y, vp.x, vp.y);
        p5.vertex(this.scherm.x + p2.x, this.scherm.y + p2.y);

        prev = end;
      }
      else if (cmd === 'Z') {
        p5.endShape(p5.CLOSE);
      }
    }

  }
  //calculate the angle in radians between two points
calcCoordsAngle(p1, p2) {
  const xDiff = p2.x - p1.x;
  const yDiff = p2.y - p1.y;
  const angle = Math.atan2(yDiff, xDiff);
  return angle;
}
  calculateControlPoints(cx, cy, rx, ry, startAngle, endAngle) {
    // This function calculates the control points of the Bézier curves that approximate the arc
    // The implementation of this function depends on the specific requirements of your application
    // This is a simplified example and may not work for all cases
    let controlPoints = [];
    for (let angle = startAngle; angle <= endAngle; angle += 0.1) {
      let x = cx + rx * Math.cos(angle);
      let y = cy + ry * Math.sin(angle);
      controlPoints.push({x, y});
    }
    return controlPoints;
   }

   calculateArcPoints(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    // This function calculates the points for an elliptical arc
    // This is a simplified example and may not work for all cases
    let points = [];
    for (let i = 0; i < 10; i++) {
      let angle = (2 * Math.PI / 10) * i;
      let xPos = x + rx * Math.cos(angle);
      let yPos = y + ry * Math.sin(angle);
      points.push({x: xPos, y: yPos});
    }
    return points;
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
    return {x:  q.x - Xdistance, y: q.y - Ydistance};
  };

  degreesToRadians = (degree) => {
    return (degree * Math.PI) / 180;
  };

  //calculate the middle of two points
calcMiddlePoint = (p1, p2) => {
  const Xdistance = p1.x - p2.x;
  const Ydistance = p1.y - p2.y;
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

calculateCenter(point1, point2, radius) {
  let radsq = radius * radius;
  let q = Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2));
  let x3 = (point1.x + point2.x) / 2;
  let y3 = (point1.y + point2.y) / 2;

  let centerX = x3 + Math.sqrt(radsq - Math.pow(q / 2, 2)) * ((point1.y - point2.y) / q);
  let centerY = y3 + Math.sqrt(radsq - Math.pow(q / 2, 2)) * ((point2.x - point1.x) / q);

  return { x: centerX, y: centerY };
}

//  calculateCirclePoints(n, rx, ry, cx, cy, startAngle, endAngle, isClockWise) {
//   const points = [];
//   let theta = startAngle;
//   while (theta <= endAngle) {
//     const x = cx + rx * Math.cos(theta);
//     const y = cy + ry * Math.sin(theta);
//     points.push({x: x, y: y});
//     theta += (2 * Math.PI) / n;
//   }

//   // Reverse the points array if the direction is clockwise
//   if (isClockWise) {
//     points.reverse();
//   }

//   return points;
// }
 
//  getAngle(start, point, end) {
//   var dx1 = start.x - point.x;
//   var dy1 = start.y - point.y;
//   var dx2 = end.x - point.x;
//   var dy2 = end.y - point.y;
 
//   var angle1 = Math.atan2(dy1, dx1);
//   var angle2 = Math.atan2(dy2, dx2);
 
//   var angle = angle2 - angle1;
//   if (angle < 0) angle += 2 * Math.PI;
 
//   // If dx1 is 0, return 0 or Math.PI / 2 depending on the relative positions of the start and end points
//   if (dx1 === 0) {
//    if (dy1 > 0) return 0;
//    if (dy1 < 0) return Math.PI / 2;
//   }
 
//   return angle;
//  }

// getAngle(center, start, end) {
//   var dx1 = start.x - center.x;
//   var dy1 = start.y - center.y;
//   var dx2 = end.x - center.x;
//   var dy2 = end.y - center.y;
 
//   var angle1 = Math.atan2(dy1, dx1);
//   var angle2 = Math.atan2(dy2, dx2);
 
//   var angle = angle2 - angle1;
//   if (angle < 0) angle += 2 * Math.PI;
 
//   return angle;
//  }
 
 
 

//  getCirclePoints(start, end, n, rx, ry, largeArcFlag, sweepFlag) {
//   const center = this.calculateCenter(start, end, rx, ry);
//   const points = this.calculateCirclePoints(n, rx, ry, center.x, center.y, start, end, false);
//   // console.log(points);
//   return points;
 
//   let filteredPoints = [];
//   for (let i = 0; i < 4; i++) {
//    filteredPoints[i] = points.filter((point) => {
//      const distance = this.getDistance(point, center);
//      const angle = this.getAngle(start, point, end);

//      switch (i) {
//        case 0: // Large arc, positive sweep
//          return distance >= 0 && distance <= rx && angle >= 0 && angle <= Math.PI;
//        case 1: // Small arc, positive sweep
//          return distance >= 0 && distance <= rx && angle >= Math.PI && angle <= 2 * Math.PI;
//        case 2: // Large arc, negative sweep
//          return distance >= 0 && distance <= ry && angle >= 0 && angle <= Math.PI / 2;
//        case 3: // Small arc, negative sweep
//          return distance >= 0 && distance <= ry && angle >= 3 * Math.PI / 2 && angle <= 2 * Math.PI;
//      }
//    });
//   }


 
//   // Select the correct arc based on the largeArcFlag and sweepFlag parameters
//   if (largeArcFlag) {
//    if (sweepFlag) {
//      return filteredPoints[0]; // Large arc, positive sweep
//    } else {
//      return filteredPoints[2]; // Large arc, negative sweep
//    }
//   } else {
//    if (sweepFlag) {
//     console.log(filteredPoints[1])
//      return filteredPoints[1]; // Small arc, positive sweep
//    } else {
//      return filteredPoints[3]; // Small arc, negative sweep
//    }
//   }
//  }

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
      points.push({x: x, y: y});
      return generatePoints(theta, points);
     } else {
      return points;
     }
  }
  
  return generatePoints(startAngle, []);
 }
 
 
 

 getDistance(p1, p2) {
   const xDiff = p2.x - p1.x;
   const yDiff = p2.y - p1.y;
   return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
 }
 

  paint(p5) {
    if (this.untouched) return;
    // p5.rect(this.scherm.x + 1, this.scherm.y + 1, this.scrn.vldSz, this.scrn.vldSz);
  }
}
