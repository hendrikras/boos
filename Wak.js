import Leeg from './Leeg.js';
import { WAK } from './constants.js';

export default class extends Leeg {
  constructor(x, y, dim) {
    super(x, y, dim);
    this.colors = ['#EEF5FF', '#86B6F6', '#B4D4FF']
    const pathData = ''
    + 'M117.95 95.7c25.01-27.3-28.72-49.4-65.53-44.38c-41.89 3.58-68.95 33.41-28.93 53.74c30.38 15.44 79.32 7.93 94.46-9.36c-.01 0-.01 0 0 0c-.01 0-.01 0 0 0zM64 109.27c-24.1 0-45.21-7.87-52.9-18.51c13.71-34.17 93.92-32.23 105.8 0c-7.69 10.63-28.8 18.51-52.9 18.51z'
    + 'M11.1 90.76c1.8-4.48 4.75-8.34 8.53-11.59l-.67-14.21C10.58 69.7 7.27 76.23 7.27 81.5c0 4.37 3.83 9.26 3.83 9.26z';
    this.viewPort= {x:128, y: 128};
    this.commands = this.getCommands(pathData);
    this.typeVeld = WAK;
  }

  paint(p5) {
    super.paint(p5);
    this.paintShape(p5, this.commands,this.colors, this.viewPort);
   }
}