import {TimerManager} from '../lib/pixi-timer/TimerManager.js'
import {TweenManager} from '../lib/pixi-tween/TweenManager.js'
export const GAME_PLAY_STATE = {
    PLAYING: 'playing',
    FINISH: 'finish',
    WAITING: 'waiting'
}

export const GAME_PLAY_MODE = {
    NORMAL: 'normal',
    COUNT_DOWN: 'count_down'
}


class GameManager {
    constructor() {
        this._keylock_state = false;
        this._game_play_state = GAME_PLAY_STATE.PLAYING;
        this._game_play_mode = GAME_PLAY_MODE.NORMAL;
        this._current_game_play
        this._current_game_level = 0
        this._timerManager = new TimerManager()
        this._tweenManager = new TweenManager()
    }

    singletonMethod() {
        return 'singletonMethod';
    }

    static staticMethod() {
        return 'staticMethod';
    }

    get keylock_state() {
        return this._keylock_state;
    }

    set keylock_state(value) {
        this._keylock_state = value;
    }

    get game_play_state() {
        return this._game_play_state;
    }

    set game_play_state(value) {
        this._game_play_state = value;
    }

    get game_play_mode() {
        return this._game_play_mode;
    }

    set game_play_mode(value) {
        this._game_play_mode = value;
    }

    get current_game_play() {
        return this._current_game_play;
    }

    set current_game_play(value) {
        this._current_game_play = value;
    }

    get current_game_level() {
        return this._current_game_level;
    }

    set current_game_level(value) {
        this._current_game_level = value;
    }

    get timerManager() {
        return this._timerManager;
    }

    set timerManager(value) {
        this._timerManager = value;
    }

    get tweenManager() {
        return this._tweenManager;
    }

    set tweenManager(value) {
        this._tweenManager = value;
    }
}

export default new GameManager();