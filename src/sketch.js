import Wereld from './Wereld.js';
import Splash from './Splash.js';
import Dimensie from './Dimensie.js';
import { FRAME_RATE, DRAW_SIZE} from './constants.js';

new p5(function(p5){
  p5.setup = function(){

    const header = p5.createDiv();
    const ridge = '20px ridge #436580';
    header.id("header-div");
    header.style('position', 'relative');
    header.style('left', '0');
    header.style('top', '0');
    header.style('margin-bottom', '10px');
    header.style('background-color', 'white');
    header.style('border', ridge);  
    header.style('width', `${DRAW_SIZE}px`);
    header.style('height', `${DRAW_SIZE/10}px`);
    header.style('display', 'flex');
    header.style('flex-direction', 'row');
    header.style('justify-content', 'space-around');
    header.class('text');

    const levelBlock = p5.createDiv();
    levelBlock.id("level-block");
    levelBlock.parent(header);
    levelBlock.html('Game');

    const lifeBlock = p5.createDiv();
    lifeBlock.id("life-block");
    lifeBlock.parent(header);
    lifeBlock.html('start');

    const canvas = p5.createCanvas(DRAW_SIZE, DRAW_SIZE); // Adjust the canvas size as needed
    canvas.style('border', ridge);

    p5.frameRate(FRAME_RATE);
      // Create a new instance of the Bbol class
      const app = new Bbol(p5);
      p5.app = app;
  }
  p5.draw = async function(){
    p5.app.startApp();
  }
  p5.keyPressed = function() {
    if(this.app.end){
      // this.app.end = false;
    }

    if (p5.keyCode === p5.LEFT_ARROW) {
      this.app.moveLeft();
    }
    else if (p5.keyCode === p5.RIGHT_ARROW) {
      this.app.moveRight();
    }
    else if (p5.keyCode === p5.DOWN_ARROW) {
      this.app.moveDown();
    }
    else if (p5.keyCode === p5.UP_ARROW) {
      this.app.moveUp();
    }
    else if (p5.keyCode === p5.ENTER) {
      this.app.confirm();
    }
  }
});

class Bbol {
  constructor(p5) {
    this.dim = new Dimensie(10, 10);
    this.wereld = new Wereld(this.dim, this, p5);
    this.splash = new Splash(this.wereld, this, p5);
    this.p5 = p5;
    this.end = true;
  }
  moveLeft(){
    this.splash.moveLeft();
    this.wereld.verplaatsMens(-1, 0);
  }
  moveRight(){
    if (this.splash.active){
    this.splash.moveRight();
    } else {
    this.wereld.verplaatsMens(1, 0);
    }
  }
  moveDown(){
    if (this.splash.active){
      this.splash.moveDown();
    } else {
      this.wereld.verplaatsMens(0, 1);
    }
 
  }
  moveUp(){
    this.splash.moveUp();
    this.wereld.verplaatsMens(0, -1);
  }
  confirm(){
    this.splash.confirm();
  }
  update(){
    if (!this.end){
      this.wereld.paint(this.p5);
    }

  }

  startApp() {  
    if (this.splash.active) {
      this.splash.paint();
      this.wereld.pause = true;
    } else {
      this.wereld.pause = false;
      this.wereld.start(this.p5);
    }
  }

  pauseApp() {
    this.wereld.pause = true;
  }

  goMain() {
    this.end = true;
    this.startGam();
  }

  startGam() {
    this.wereld.start();
  }

  getDim() {
    return this.dim;
  }
}
