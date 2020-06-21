import * as PIXI from 'pixi.js'
import {CONFIG} from './managers/config.js'
import GameManager from './managers/game_manager'
import { SCENE } from './scenes/scenes.js';
import sound from 'pixi-sound';

//
const app = new PIXI.Application({
  width: CONFIG.window_width,
  height: CONFIG.window_heigh,
  backgroundColor: CONFIG.game_backgroundColor,  
  view: document.querySelector('#scene'),
  resolution: window.devicePixelRatio || 1
});

let loader = new PIXI.Loader()
loader
  .add('bl', CONFIG.url_img_gameplay)
  .add('button', CONFIG.url_img_button)
  .add('sound_move', CONFIG.url_sound_move)
  .add('sound_win', CONFIG.url_sound_win)
  .add('sound_game_over',CONFIG.url_sound_game_over)
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
    GameManager.timerManager.update()
  }, this);

  resize(); 
  window.addEventListener('resize', resize);

}



function gameLoop(delta) {

  //Update the current game main_state:
  main_state(delta);
}

function play(delta) {

  GameManager.tweenManager.update()

}

function resize() { 
  app.renderer.view.style.position = 'absolute'; 
  app.renderer.view.style.left = ((window.innerWidth - app.renderer.width) >> 1) + 'px';
  app.renderer.view.style.top = ((window.innerHeight - app.renderer.height) >> 1) + 'px'; 
}