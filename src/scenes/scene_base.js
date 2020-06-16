import { CONFIG } from '../managers/config.js';

export class Scene_Base extends PIXI.Container {
    constructor(settings={}){
        super()

        this.settings = {
            // Default values
            width: 500,
            height: 500,
            x:0,
            y:0
        }

        this.update(settings)

        this.width_dynamic = this.settings.width
        this.height_dynamic = this.settings.height
        this.graphics = new PIXI.Graphics()
        this.addChild(this.graphics)
    }

    drawBound(){
        let width = 10
        this.graphics.lineStyle(width, CONFIG.scene_bound_color, 1)
        this.graphics.drawRect(-width/2, -width/2, this.settings.width+width, this.settings.height+width, 2)
        this.graphics.endFill()
    }

    update(settings) {
        // Creating new settings which include old ones and apply new ones over it
        this.settings = {
            ...this.settings, // including old settings
            ...settings, // including new settings
        }

        this.x = this.settings.x
        this.y = this.settings.y
    }
}