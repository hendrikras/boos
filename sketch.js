import p5 from 'https://esm.sh/p5@1.8.0';
import Boos from './Boos.js';
import { FRAME_RATE, DRAW_SIZE } from './constants.js';

function createButton(p5, parent, position, size, text, color, hoverColor, clickHandler) {
  const button = p5.createButton(text);
  button.parent(parent);
  button.position(position.x, position.y);
  button.size(size.w, size.h);
  button.style('background-color', color);
  // button.style('color', 'white');
  button.style('border-radius', '50%');
  button.style('border', '20px solid black');
  button.mousePressed(clickHandler);
  button.mouseOver(() => {
    button.style('color', hoverColor);
  });
  button.mouseOut(() => {
    button.style('color', color);
  });
  return button;
}
function mobileAndTabletCheck() {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

new p5(function (p5) {
  p5.setup = function () {
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
    header.style('height', `${DRAW_SIZE / 10}px`);
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
    const inputs = p5.createDiv();
    inputs.style('position', 'absolute');
    inputs.style('bottom', 0);

    if (mobileAndTabletCheck()) {
      const leftSVG = '<svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 493.578 493.578" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M487.267,225.981c0-17.365-13.999-31.518-31.518-31.518H194.501L305.35,83.615c12.24-12.24,12.24-32.207,0-44.676 L275.592,9.18c-12.24-12.24-32.207-12.24-44.676,0L15.568,224.527c-6.12,6.12-9.256,14.153-9.256,22.262 c0,8.032,3.136,16.142,9.256,22.262l215.348,215.348c12.24,12.239,32.207,12.239,44.676,0l29.758-29.759 c12.24-12.24,12.24-32.207,0-44.676L194.501,299.498h261.094c17.366,0,31.519-14.153,31.519-31.519L487.267,225.981z"></path> </g> </g></svg>';
      createButton(p5, inputs, { x: -150, y: -100 }, { w: 100, h: 100 }, leftSVG, '#ffd9e5', '#FFFFFF', () => {
        this.app.moveLeft();
      });

      const downSvg = '<svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 493.578 493.578" xml:space="preserve" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(270)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M487.267,225.981c0-17.365-13.999-31.518-31.518-31.518H194.501L305.35,83.615c12.24-12.24,12.24-32.207,0-44.676 L275.592,9.18c-12.24-12.24-32.207-12.24-44.676,0L15.568,224.527c-6.12,6.12-9.256,14.153-9.256,22.262 c0,8.032,3.136,16.142,9.256,22.262l215.348,215.348c12.24,12.239,32.207,12.239,44.676,0l29.758-29.759 c12.24-12.24,12.24-32.207,0-44.676L194.501,299.498h261.094c17.366,0,31.519-14.153,31.519-31.519L487.267,225.981z"></path> </g> </g></svg>';
      createButton(p5, inputs, { x: -50, y: -100 }, { w: 100, h: 100 }, downSvg, '#ffd9e5', '#FFFFFF', () => {
        this.app.moveDown();
      });

      const rightSVG = '<svg fill="#000000"  version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 493.578 493.578" xml:space="preserve" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M487.267,225.981c0-17.365-13.999-31.518-31.518-31.518H194.501L305.35,83.615c12.24-12.24,12.24-32.207,0-44.676 L275.592,9.18c-12.24-12.24-32.207-12.24-44.676,0L15.568,224.527c-6.12,6.12-9.256,14.153-9.256,22.262 c0,8.032,3.136,16.142,9.256,22.262l215.348,215.348c12.24,12.239,32.207,12.239,44.676,0l29.758-29.759 c12.24-12.24,12.24-32.207,0-44.676L194.501,299.498h261.094c17.366,0,31.519-14.153,31.519-31.519L487.267,225.981z"></path> </g> </g></svg>';

      createButton(p5, inputs, { x: 50, y: -100 }, { w: 100, h: 100 }, rightSVG, '#ffd9e5', '#FFFFFF', () => {
        this.app.moveRight();
      });

      const upSvg = '<svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 493.578 493.578" xml:space="preserve" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(90)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M487.267,225.981c0-17.365-13.999-31.518-31.518-31.518H194.501L305.35,83.615c12.24-12.24,12.24-32.207,0-44.676 L275.592,9.18c-12.24-12.24-32.207-12.24-44.676,0L15.568,224.527c-6.12,6.12-9.256,14.153-9.256,22.262 c0,8.032,3.136,16.142,9.256,22.262l215.348,215.348c12.24,12.239,32.207,12.239,44.676,0l29.758-29.759 c12.24-12.24,12.24-32.207,0-44.676L194.501,299.498h261.094c17.366,0,31.519-14.153,31.519-31.519L487.267,225.981z"></path> </g> </g></svg>';
      createButton(p5, inputs, { x: -50, y: -200 }, { w: 100, h: 100 }, upSvg, '#ffd9e5', '#000000', () => {
        this.app.moveUp();
      });

      const confirmSVG = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7V8.2C20 9.88016 20 10.7202 19.673 11.362C19.3854 11.9265 18.9265 12.3854 18.362 12.673C17.7202 13 16.8802 13 15.2 13H4M4 13L8 9M4 13L8 17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';
      createButton(p5, inputs, { x: 50, y: -200 }, { w: 100, h: 100 }, confirmSVG, '#ffd9e5', '#000000', () => {
        this.app.confirm();
      });
    }

    const canvas = p5.createCanvas(DRAW_SIZE, DRAW_SIZE); // Adjust the canvas size as needed
    canvas.style('border', ridge);

    p5.frameRate(FRAME_RATE);
    // Create a new instance of the Boos class
    const app = new Boos(p5);
    p5.app = app;
  }
  p5.draw = async function () {
    p5.app.startApp();
  }
  p5.keyPressed = function () {
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