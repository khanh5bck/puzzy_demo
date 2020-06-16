import { Scene_Base } from './scene_base.js';
import { Vector, Tile } from '../models/models.js'
import { CONFIG } from '../managers/config.js';

export class SceneGamePlay extends Scene_Base {
  constructor(setting) {
    super(setting)
    GameManager.getInstance().setGamePlayState(GAME_PLAY_STATE.WAITING)
    this.state
    this.grid = new Array()
    this.move_speed = CONFIG.move_speed
    this.setupScene()
    //need unsubscribe when destroy scene
    this.key_movement = this.movement()

    this.scale.set(0.8, 0.8);
    this.position.set(50, 50);
    this.timer = PIXI.timerManager.createTimer(1000);

    GameManager.getInstance().setCurrentGamePlay(this)
    this.message_start = this.messageStartGame()

    this.sound_move = PIXI.sound.Sound.from(CONFIG.url_sound_move);
    this.sound_win = PIXI.sound.Sound.from(CONFIG.url_sound_win);
    this.sound_game_over = PIXI.sound.Sound.from(CONFIG.url_sound_game_over);

  }

  setupScene() {
    const map_col = this.settings.map_col
    const map_row = this.settings.map_row
    const space_x = map_col - 1;
    const space_y = 0;
    let banner_texture = PIXI.utils.TextureCache[CONFIG.url_img_gameplay];
    let banner_sprite = new PIXI.Sprite(banner_texture);
    let banner_width = banner_sprite.width;
    let banner_height = banner_sprite.height;

    let tile_width = Math.floor(banner_width / map_col);
    let tile_heigt = Math.floor(banner_height / map_row);

    //re draw bound scene folow tile 
    this.settings.width = tile_width * map_col;
    this.settings.height = tile_heigt * map_row;
    this.drawBound()

    for (let i = 0; i < map_col; i++) {
      let col_array = new Array()
      // for (let j = map_row-1; j >= 0; j--) {
      for (let j = 0; j < map_row; j++) {
        var new_banner_texture = new PIXI.Texture(banner_texture);
        let rectangle = new PIXI.Rectangle(i * tile_width, j * tile_heigt, tile_width, tile_heigt);
        new_banner_texture.frame = rectangle;
        let tile_settings = {
          col:i,
          row:j,
          texture:new_banner_texture,
          map_col:map_col,
          map_row:map_row,
          onTap: (the_tile) => {
            this.tapTheTile(the_tile);
          }
        }
        let tile = new Tile(tile_settings);
        tile.x = i * tile_width
        tile.y = j * tile_heigt

        col_array[j] = tile
        if (i == space_x && j == space_y) {
          // add space
          tile.visible = false;
          this.addChild(tile)
        }
        else {
          this.addChild(tile)
        }

      }
      this.grid[i] = col_array;
    }

    this.randomIndexGrid()
  }

  shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  randomIndexGrid(){
    // console.log(this.grid)
    let tmp = new Array()

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        tmp.push(this.grid[i][j])
      }
    }
    
    tmp = this.shuffle(tmp)
    // console.log(tmp)
    for(let i=0;i<tmp.length;i++){
      let row = i% this.settings.map_row
      let col =  Math.floor(i/this.settings.map_row)
      this.grid[col][row] = tmp[i]
    }
    // console.log(this.grid)
    this.updateGridIndex()
  }

  //reupdate tile index in grid
  updateGridIndex(){
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j].updateIndex({row:j,col:i})
        this.grid[i][j].moveToCureentIndex()
      }
    }
  }

  startGame() {
    
    console.log('game start')
    this.removeChild(this.message_start)
    GameManager.getInstance().setGamePlayState(GAME_PLAY_STATE.PLAYING)
    
    if(GameManager.getInstance().getGamePlayMode()==GAME_PLAY_MODE.COUNT_DOWN){
      this.settingCountDownMode()
    }else{
      this.settingNormalMode()
    }
  }

  settingCountDownMode(){
    let countdown = CONFIG.countdown_time*(GameManager.getInstance().getCurrentGameLevel()+1);
    
    let label_time = this.settings.scene_ui.label_time
    label_time.text = 'Time: ' + countdown;
    this.timer.repeat = countdown;
    this.timer.on('start', elapsed => { console.log('start'); });
    this.timer.on('end', elapsed => {
      console.log('end', elapsed);
      label_time.text = 'Time up!';
      this.checkGameOver()
    });
    this.timer.on('repeat', (elapsed, repeat) => {
      // console.log('repeat', repeat);
      countdown--;
      label_time.text = 'Time: ' + countdown;
    });
    this.timer.on('stop', elapsed => { console.log('stop'); });

    this.timer.start();
  }

  settingNormalMode(){
    let label_time = this.settings.scene_ui.label_time
    let time_count = 0
    label_time.text = 'Time: ' + time_count;
    this.timer.loop = true
    this.timer.on('repeat', (elapsed, repeat) => {
      // console.log('repeat', repeat);
      time_count++;
      label_time.text = 'Time: ' + time_count;
    });
    this.timer.start()
  }

  inGrid(x, y) {
    // check if vector(x,y) in map
    return x >= 0 && x < this.settings.map_col && y >= 0 && y < this.settings.map_row
  }

  checkTilesPosition() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (!this.grid[i][j].isCorrect(i, j)) {
          return false
        }
      }
    }

    return true
  }

  checkGameComplete() {
    if (this.checkTilesPosition()) {
      GameManager.getInstance().setGamePlayState(GAME_PLAY_STATE.FINISH);
      this.timer.stop()

      const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 66,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
      });

      const richText = new PIXI.Text('LEVEL COMPLETE!', style);
      richText.pivot.set(richText.width / 2, richText.height / 2)
      richText.x = this.width_dynamic / 2;
      richText.y = this.height_dynamic / 2;

      this.addChild(richText);
      this.sound_win.play()
    }
  }

  checkGameOver() {
    if (!this.checkTilesPosition()) {
      GameManager.getInstance().setGamePlayState(GAME_PLAY_STATE.FINISH);

      const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 66,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
      });

      const richText = new PIXI.Text('TIME UP! GAME OVER!', style);
      richText.pivot.set(richText.width / 2, richText.height / 2)
      richText.x = this.width_dynamic / 2;
      richText.y = this.height_dynamic / 2;

      this.addChild(richText);
      this.sound_game_over.play()
    }
  }

  messageStartGame() {
    if (GameManager.getInstance().getGamePlayState()==GAME_PLAY_STATE.WAITING) {
      const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 46,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 540,
      });

      const richText = new PIXI.Text('PRESS ARROW BUTTON OR TAP THE TILE TO START!', style);
      // richText.anchor.set(0.5)
      richText.pivot.set(richText.width / 2, richText.height / 2)
      
      richText.x = this.width_dynamic / 2;
      richText.y = this.height_dynamic / 2;

      this.addChild(richText);
      return richText
    }
  }

  // swap tile with space
  swapTile(obj1, obj2) {
    let current_index = obj1.getCurrentIndex()
    let next_index = obj2.getCurrentIndex()

    this.grid[current_index.col][current_index.row] = obj2
    this.grid[next_index.col][next_index.row] = obj1

    this.grid[current_index.col][current_index.row].updateIndex(current_index)
    this.grid[next_index.col][next_index.row].updateIndex(next_index) 
    
    let tmp_position = new Vector(obj1.x, obj1.y)
    const tween = PIXI.tweenManager.createTween(obj1);
    tween.from({ x: obj1.x, y: obj1.y }).to({ x: obj2.x, y: obj2.y })
    tween.time = this.move_speed;
    tween.on('end', () => {
      GameManager.getInstance().setKeyLockState(false);
      this.checkGameComplete();
      this.sound_move.play()
    });
    tween.start();

    
    // this.grid[obj1.col][obj1.row] = obj2
    // this.grid[obj2.col][obj2.row] = obj1
    obj2.set_position(tmp_position);

    
    
  }

  tapTheTile(the_tile){
    // console.log('tap the tile')
    // console.log(the_tile.getCurrentIndex())
    let list_vector = [Vector.left, Vector.right, Vector.up, Vector.down]
    for(let i=0;i<list_vector.length;i++){
      let vector = list_vector[i]
      let next_i = the_tile.col + vector.x
      let next_j = the_tile.row + vector.y

      if (this.inGrid(next_i, next_j)) {
        let next_tile = this.grid[next_i][next_j]
        //if space, move current tile to space
        if (next_tile.visible == false) {
          this.logicMoveTile(vector)
          // this.swapTile(the_tile, next_tile)
          //swap tile
          
          return;
        }
      }
    }
  }

  logicMoveTile(vector) {
    //vector: left,right,up,down
    //move tile if beside it is space
    if(GameManager.getInstance().getGamePlayState()==GAME_PLAY_STATE.WAITING){
      this.startGame()
    }

    if (GameManager.getInstance().getKeyLockState()
      || GameManager.getInstance().getGamePlayState() != GAME_PLAY_STATE.PLAYING) {
      return
    }
    GameManager.getInstance().setKeyLockState(true)

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {

        let next_i = i + vector.x
        let next_j = j + vector.y
        if (this.inGrid(next_i, next_j)) {
          let next_tile = this.grid[next_i][next_j]
          //if space, move current tile to space
          if (next_tile.visible == false) {
            let current_tile = this.grid[i][j]
            this.swapTile(current_tile, next_tile)
            //swap tile
            // this.grid[i][j] = next_tile
            // this.grid[next_i][next_j] = current_tile
            // // this.grid[obj1.col][obj1.row] = obj2
            // // this.grid[obj2.col][obj2.row] = tmp
            
            // this.grid[next_i][next_j].updateIndex({col:next_i, row:next_j})
            // this.grid[i][j].updateIndex({col:i, row:j})
            return;
          }
        }
      }
    }

    GameManager.getInstance().setKeyLockState(false)
  }


  //#region movekey
  movement() {
    //Capture the keyboard arrow keys
    let left = this.keyboard("ArrowLeft"),
      up = this.keyboard("ArrowUp"),
      right = this.keyboard("ArrowRight"),
      down = this.keyboard("ArrowDown");

    //Left arrow key `press` method
    left.press = () => {
      //Change the cat's velocity when the key is pressed
      this.logicMoveTile(Vector.left)
      console.log('press lefttt')
    };

    //Up
    up.press = () => {
      this.logicMoveTile(Vector.up)
    };

    //Right
    right.press = () => {
      this.logicMoveTile(Vector.right)
    };

    //Down
    down.press = () => {
      this.logicMoveTile(Vector.down)
    };

    return { left, up, right, down }
  }

  keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };

    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };

    return key;
  }
  //#endregion

  destroyScene() {
    this.timer.stop()
    PIXI.timerManager.removeTimer(this.timer)
    this.key_movement.left.unsubscribe()
    this.key_movement.right.unsubscribe()
    this.key_movement.up.unsubscribe()
    this.key_movement.down.unsubscribe()
    this.parent.removeChild(this)
    this.destroy()
    console.log('destroy game play')
  }
}