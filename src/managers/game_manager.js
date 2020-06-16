

const GAME_PLAY_STATE = {
    PLAYING: 'playing',
    FINISH: 'finish',
    WAITING: 'waiting'
}

const GAME_PLAY_MODE = {
    NORMAL: 'normal',
    COUNT_DOWN: 'count_down'
}

var GameManager = (function () {
    var instance;

    function init() {

        var keylock_state = false;
        var game_play_state = GAME_PLAY_STATE.PLAYING;
        var game_play_mode = GAME_PLAY_MODE.NORMAL;
        var current_game_play
        var current_game_level = 0
        return {
            setKeyLockState: function (x) {
                keylock_state = x;
            },
            getKeyLockState: function () {
                return keylock_state;
            },
            setGamePlayState: function (x) {
                game_play_state = x;
            },
            getGamePlayState: function () {
                return game_play_state;
            },
            setCurrentGamePlay: function (x) {
                current_game_play = x;
            },
            getCurrentGamePlay: function () {
                return current_game_play
            },
            setCurrentGameLevel: function (x) {
                current_game_level = x;
            },
            getCurrentGameLevel: function () {
                return current_game_level
            },
            setGamePlayMode: function (x) {
                game_play_mode = x;
            },
            getGamePlayMode: function () {
                return game_play_mode
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) instance = init();
            return instance;
        }
    }
})();
