

let config_level = [
    {
        map_col:3,
        map_row:2
    },
    {
        map_col:4,
        map_row:3
    },
    {
        map_col:5,
        map_row:4
    },
    {
        map_col:7,
        map_row:5
    },
    {
        map_col:8,
        map_row:6
    },
    {
        map_col:9,
        map_row:7
    }
]
export var CONFIG = {
    // main config
     window_width: 1200,
     window_heigh: 560,
     url_img_button: './assets/button.png',
     url_img_gameplay: './assets/bl.jpg',
     url_sound_move:'./assets/sounds/wood.mp3',
     url_sound_win:'./assets/sounds/win.mp3',
     url_sound_game_over:'./assets/sounds/game_over.mp3',
     game_backgroundColor:'0xfaf7ff',
     // game play config
     game_levels:config_level,
     move_speed:80    ,
     countdown_time:60,
     show_tile_lable:true,
     // scene config
     scene_bound_color:0Xc3a9fe,
}

