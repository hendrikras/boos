import {Veld} from './Veld.js';

export class Grave extends Veld {
  constructor() {
    super();
    
    // Load the SVG file
   
  }

  paint(p5) {
    const svg = p5.loadImage('./assets/tombstone-rip-svgrepo-com.svg');
    
    // Parse the SVG file and extract the shapes
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const shapes = doc.querySelectorAll('path, polygon, rect');
    
    // Loop through each shape and add it to the Veld instance
    for (const shape of shapes) {
      const d = shape.getAttribute('d');
      const fill = shape.style.fill;
      const stroke = shape.style.stroke;
      const lineWidth = shape.style.strokeWidth;
      
      if (d) {
        this.addShape(d, fill, stroke, lineWidth);
      } else if (shape.points) {
        this.addShape(shape.points, fill, stroke, lineWidth);
      }
    }
  }
}