import Wereld from './Wereld.js';
import Splash from './Splash.js';
import Dimensie from './Dimensie.js';
import { FRAME_RATE } from './constants.js';

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
    header.style('width', '500px');
    header.style('height', '50px');
    header.style('display', 'flex');
    header.style('flex-direction', 'row');
    header.style('justify-content', 'space-around');
    header.class('text');

    const levelBlock = p5.createDiv();
    levelBlock.id("level-block");
    levelBlock.parent(header);
    levelBlock.html('level:0');

    const lifeBlock = p5.createDiv();
    lifeBlock.id("life-block");
    lifeBlock.parent(header);
    lifeBlock.html('life:1');

    const canvas = p5.createCanvas(500, 500); // Adjust the canvas size as needed
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
      this.app.end = false;
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
  }
});

class Bbol {
  constructor(p5) {
    this.dim = new Dimensie(10, 10);
    this.wereld = new Wereld(this.dim, this, p5);
    this.splash = new Splash(this.wereld, this, p5);
    this.p5 = p5;
    this.end = false;
  }
  moveLeft(){
    this.wereld.verplaatsMens(-1, 0);
  }
  moveRight(){
    this.wereld.verplaatsMens(1, 0);
  }
  moveDown(){
    this.wereld.verplaatsMens(0, 1);
  }
  moveUp(){
    this.wereld.verplaatsMens(0, -1);
  }
  update(){
    if (!this.end){
      this.wereld.paint(this.p5);
    }

  }

  startApp() {
    if (this.end) {
      this.splash.paint()
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
    console.log("GAME OVER");
  }

  startGam() {
    this.wereld.start();
    this.setCurrent(this.wereld);
  }

  getDim() {
    return this.dim;
  }
}
