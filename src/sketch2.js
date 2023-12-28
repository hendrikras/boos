import Veld from './Doos.js';
import Punt from './Punt.js';
// import Scrn from './Scrn.js';
// import { Constants } from './constants.js';
// import Snap from 'https://esm.sh/snapsvg';

// const d = Constants.DRAW_SIZE;

const colors = [
  '#D2D1CD',
  '#A8A7A4',
  '#868683',
  '#6B6B69',
  '#565654',
  '#454543',
  '#373736',
  '#2C2C2B',
  '#232322',
  '#1C1C1B'
];

// const pathData = 'M248.399,0.135C135.421,4.152,47.514,100.436,47.514,213.484V508.8c0,2.792,3.432,4.127,5.319,2.069l57.191-62.39c3.756-4.098,10.216-4.098,13.971,0l55.336,60.365c3.858,4.209,10.493,4.209,14.35,0l55.334-60.365c3.756-4.098,10.216-4.098,13.971,0l55.334,60.365c3.858,4.209,10.493,4.209,14.35,0l55.336-60.365c3.756-4.098,10.216-4.098,13.971,0l57.191,62.39c1.887,2.059,5.319,0.724,5.319-2.069V208.486C464.489,90.819,367.009-4.082,248.399,0.135z';
 
const vp = { x: 512, y: 512 };

const veld = new Veld(0, 0, {width: 10, height:10});

new p5(function(p5){
    p5.setup = function(){

  p5.createCanvas(400, 400);
  const scherm = new Punt(p5.width / 2, p5.height / 2);
  veld.scherm = scherm;
}

p5.draw = async function(){
  p5.background(255);
  veld.paint(this);

  // veld.paintShape(this, pathData, colors, vp);
}
});