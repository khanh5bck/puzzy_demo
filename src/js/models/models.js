import * as PIXI from 'pixi.js'
//define vector
export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // console.log('newvector')

    }

    static get left() {
        return new Vector(-1, 0);
    }

    static get right() {
        return new Vector(1, 0);
    }

    static get up() {
        return new Vector(0, -1);
    }

    static get down() {
        return new Vector(0, 1);
    }

}

export class Tile extends PIXI.Sprite {
    constructor(settings) {
        super(settings.texture);
        this.settings = settings

        this.col = settings.col;
        this.row = settings.row;

        let title_index = new PIXI.Text("" + (settings.row * settings.map_col + settings.col + 1), { fill: 0xffffff, stroke: '#4a1850', strokeThickness: 5 });
        this.addChild(title_index)

        this.interactive = true;
        this.buttonMode = true;
        this.onTap = this.onTap.bind(this)
        this.on('pointertap', this.onTap)
    }

    onTap() {
        if (this.settings.onTap) {
            this.settings.onTap(this)
        }
    }

    //update current tile index in grid 
    updateIndex(index) {
        this.row = index.row
        this.col = index.col
    }

    //get current index
    getCurrentIndex() {
        return { row: this.row, col: this.col }
    }

    moveToCureentIndex() {
        this.position.set(this.width * this.col, this.height * this.row)
    }

    set_position(position) {
        this.x = position.x;
        this.y = position.y;
    }

    isCorrect(col, row) {
        return col == this.settings.col && row == this.settings.row;
    }
}