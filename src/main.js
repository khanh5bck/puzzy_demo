import { SCENE } from './scenes/scenes.js';
import { CONFIG } from './managers/config.js'

let Application = PIXI.Application,
  loader = PIXI.loader

console.log(location.pathname);

const app = new Application({ width: CONFIG.window_width, height: CONFIG.window_heigh, backgroundColor: CONFIG.game_backgroundColor,transparent: false });

document.body.appendChild(app.view);

loader
  .add(CONFIG.url_img_gameplay)
  .add('button', CONFIG.url_img_button)
  .load(setup);

//Define any variables that are used in more than one function
var main_state;

function setup() {


  let ui_settings = {
    width:500,
    height:600,
    x:750,
    y:50,
    app:app,

  }

  const scene_ui = new SCENE.SceneUI(ui_settings)
  scene_ui.changeLevel(0)

  app.stage.addChild(scene_ui);

  //Set the game main_state
  main_state = play;
  //Render the stage   
  app.renderer.render(app.stage);
  //Start the game loop 
  app.ticker.add(delta => {
    gameLoop(delta);
  });

  app.ticker.add(() => {
    PIXI.timerManager.update();
  }, this);

  resize(); 
  window.addEventListener('resize', resize);

}



function gameLoop(delta) {

  //Update the current game main_state:
  main_state(delta);
}

function play(delta) {

  PIXI.tweenManager.update();

}

function resize() { 
  app.renderer.view.style.position = 'absolute'; 
  app.renderer.view.style.left = ((window.innerWidth - app.renderer.width) >> 1) + 'px';
  app.renderer.view.style.top = ((window.innerHeight - app.renderer.height) >> 1) + 'px'; 
}
