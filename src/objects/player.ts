import Phaser from "phaser";
import * as Types from "../types/index"

export default class Player extends Phaser.GameObjects.Text{
    constructor(config){
        super(config.scene, config.x, config.y, config.text, config.style)
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        // Type Guard
        if('setCollideWorldBounds' in this.body){
            this.body.setCollideWorldBounds(true)
        }
    }
    MovementSpeed: number = 150
    keys: Types.keysTypes = {
        left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    }
    recordedKeys: Types.keyBool
    jumpCooldown: number = 0
    update(time: number, delta: number): void{
        this.handlePlayerMovement(time)
    }
    handlePlayerMovement(time: number){
        // reset
        if('setVelocity' in this.body)
            this.body.setVelocity(0);
        // check input
        let recordedKeys: Types.keyBool = {
            left: this.keys.left.isDown,
            right: this.keys.right.isDown,
            jump: this.keys.jump.isDown,
            crouch: this.keys.crouch.isDown
        };
        // handle movement
        if (recordedKeys.left === true)
        {
            console.log("l")
            this.body.velocity.x = -this.MovementSpeed
        } else if (recordedKeys.right === true)
        {
            console.log("r")
            this.body.velocity.x = this.MovementSpeed
        } 
        else  if (recordedKeys.jump === true && time - this.jumpCooldown >= 500)
        {
            this.jumpCooldown = time
            console.log("up")
            this.body.velocity.y = -3000
        } else if (recordedKeys.crouch === true)
        {
            console.log("down")
        }
        //console.log('touching' in this.body && this.body.touching.down)
    }
}