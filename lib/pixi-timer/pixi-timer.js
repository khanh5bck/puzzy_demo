import { TimerManager } from './TimerManager.js';
import { Timer } from './Timer.js';

let timer = {
  TimerManager : TimerManager,
  Timer : Timer
};

if(!PIXI.timerManager){
  PIXI.timerManager = new TimerManager();

  PIXI.timer = timer;
}

