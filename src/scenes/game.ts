import Phaser from "phaser";
import Player from "~/objects/player";
import * as Types from "../types/index"

export default class Game extends Phaser.Scene{
    constructor(){
        super('game');
    }
    player: Phaser.GameObjects.Text
    keys: Types.keysTypes
    recordedKeys: Types.keyBool
    create(){
        // player
        const layer1: string = ' o '
        const layer2: string = '/|\\'
        const layer3: string = '/ \\'
        const playerSprite: string = 
            `${layer1}\n${layer2}\n${layer3}`
        this.player = new Player({
            scene: this,
            x: this.scale.width/2 - 10,
            y: this.scale.height/2,
            text: playerSprite,
            style: {
                fontSize: 30
            }
        })
        const worldWidth = this.scale.width * 1.2
        const worldHeigth = this.scale.height - 10
        this.physics.world.setBounds(0, 0, worldWidth, worldHeigth)
        this.physics.world.setBoundsCollision();
        // const camera = this.cameras.main;
        // camera.setBounds(0, 0, worldWidth, worldHeigth);
        // camera.startFollow(this.player)
        // keys
        this.keys = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            crouch: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        };
    }
    update(time: number, delta: number): void {
        this.record(delta)
        this.player.update(time, delta)
    }
    // record input
    record(delta: number){
        let keys: Types.keyBool = {
            left: this.keys.left.isDown,
            right: this.keys.right.isDown,
            jump: this.keys.jump.isDown,
            crouch: this.keys.crouch.isDown
        };
        if(typeof window.recording === 'undefined')
            window.time = 0
        window.time += delta
        window.recording = {
            time: window.time,
            keys: keys
        };
        this.recordedKeys = keys;
    }
}