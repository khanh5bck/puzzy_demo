import { Scene_Base } from './scene_base.js'
import { Button } from '../components/button.js'
import { SCENE } from './scenes.js';
import { CONFIG } from '../managers/config.js';
import * as PIXI from 'pixi.js'
import {GAME_PLAY_MODE, GAME_PLAY_STATE} from '../managers/game_manager.js'
import GameManager from '../managers/game_manager';
export class Scene_UI extends Scene_Base{
    constructor(settings={}){
        super(settings)

        //message
        this.label_time = new PIXI.Text('time: 0')
        this.label_level = new PIXI.Text('level')
        this.setUpUI()

        this.scale.set(0.8,0.8);
    }

    setUpUI(){
        let text_style = {
            fontSize: 35,
            label: 'Button',
            fill: '#6495ed',
            wordWrap: true, 
            wordWrapWidth: this.settings.width-20,
            wordWrapHeight: 200
        }

        //time text
        this.label_time.style = text_style
        this.label_time.anchor.set(0,0.5)
        this.label_time.position.set(300,50)
        this.addChild(this.label_time)
        

        //level text
        this.label_level.style = text_style
        this.label_level.anchor.set(0.5)
        this.label_level.position.set(100,50)
        this.addChild(this.label_level)

        let banner_texture = PIXI.utils.TextureCache[CONFIG.url_img_gameplay];
        let banner_sprite = new PIXI.Sprite(banner_texture);
        banner_sprite.pivot.set(banner_sprite.width/2,banner_sprite.height/2)
        banner_sprite.width = 266
        banner_sprite.height = 200
        
        banner_sprite.position.set(this.width_dynamic/2,180)
        this.addChild(banner_sprite)
        

        const btn_reset = new Button({
            label: 'Reset',
            width: 200,
            height: 80,
            onTap: () => {
                console.log('Reset');
                // step = 0 <=> reload level
                this.changeLevel(0);
            }
            });
        btn_reset.position.set(this.width_dynamic/2-110,350);
        this.addChild(btn_reset)

        console.log('btn_game_mode_toggle')
        const btn_game_mode_toggle = new Button({
            label: 'Game mode: Normal',
            width: 420,
            height: 80,
            onTap: () => {
                console.log('Reset');
                // step = 0 <=> reload level
                this.changeGameMode(btn_game_mode_toggle.label);
            }
            });
        btn_game_mode_toggle.position.set(this.width_dynamic/2,450);
        this.addChild(btn_game_mode_toggle)

        const btn_next_level = new Button({
            label: 'Next level',
            width: 200,
            height: 80,
            onTap: () => {
                console.log('Next level');
                // step = 1 <=> next level
                this.changeLevel(1);
            }
            });
        btn_next_level.position.set(this.width_dynamic/2 + 110,550)
        this.addChild(btn_next_level)

        const btn_previous_level = new Button({
            label: 'Previous level',
            width: 200,
            height: 80,
            onTap: () => {
                console.log('Previous level');
                // step = 1 <=> next level
                this.changeLevel(-1);
            }
            });
        btn_previous_level.position.set(this.width_dynamic/2-110,550)
        this.addChild(btn_previous_level)
        
        this.drawBound()
    }

    addNewGamePlay(settings){
        if(GameManager.current_game_play){
            let current_game_play = GameManager.current_game_play
            current_game_play.destroyScene()
        }
        settings.width_dynamic = 800
        settings.height_dynamic = 560
        let new_scene_game_play = new SCENE.SceneGamePlay(settings)
        this.settings.app.stage.addChild(new_scene_game_play);

        if(GameManager.game_play_mode == GAME_PLAY_MODE.COUNT_DOWN){
            let count_down_time =CONFIG.countdown_time*(GameManager.current_game_level+1)
            this.label_time.text = 'Time: '+count_down_time
        }else{
            this.label_time.text = 'Time: 0'
        }
    }

    // step = 0 <=> reload level
    // step = -1 <=> previous level
    // step = 1 <=> Next level
    changeLevel(step=0){
        let game_levels = CONFIG.game_levels
        let current_level = GameManager.current_game_level
        let next_level = current_level+step
        if(next_level < game_levels.length && next_level >=0){
            let next_level_config = game_levels[current_level+step]
            next_level_config.scene_ui = this
            GameManager.current_game_level = next_level
            this.addNewGamePlay(next_level_config)
            this.label_level.text = 'level '+ (next_level==0?'MIN':next_level==game_levels.length-1?'MAX':next_level )
        }
    }

    changeGameMode(lable){
        if(GameManager.game_play_state== GAME_PLAY_STATE.PLAYING){
            return
        }

        if(GameManager.game_play_mode == GAME_PLAY_MODE.NORMAL){
            GameManager.game_play_mode = GAME_PLAY_MODE.COUNT_DOWN
            let count_down_time =CONFIG.countdown_time*(GameManager.current_game_level+1)
            this.label_time.text = 'Time: '+count_down_time
            lable.text = 'Game mode: Count down'
        }else{
            GameManager.game_play_mode = GAME_PLAY_MODE.NORMAL
            this.label_time.text = 'Time: 0'
            lable.text = 'Game mode: Normal'
        }
    }    
}