import Phaser from "phaser";
import * as Types from "../types/index"
import * as SpritePlayer from "../consts/spritesPlayer"

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
    idle: boolean = true
    isCrouching: boolean = false
    
    update(time: number, delta: number): void{
        this.handlePlayerMovement(time)
        this.handlePlayerSize()
    }
    handlePlayerSize(){
        if(this.idle){
            this.text = SpritePlayer.idle
            this.setDisplaySize(55, 29 * 3)
        }else if(this.isCrouching){
            // help in init to spawn player directly on platform
            this.text = SpritePlayer.crouch
            this.setDisplaySize(55, 29 * 2)
        }
        console.log("idle ", this.idle, " crouch ", this.isCrouching)
    }
    handlePlayerMovement(time: number){
        // console.log(this.isCrouching)
        // if(this.keys.crouch.isUp){
        //     this.text = SpritePlayer.idle
        //     this.setDisplaySize(55, 29 * 3)
        //     // this.setPosition(this.x, this.y - 50)
        // }else if (this.keys.crouch.isDown && ("blocked" in this.body) && this.body.blocked.down){
        //     this.text = SpritePlayer.crouch
        //     this.setDisplaySize(55, 29 * 2)
        //     // nie wiem ile?
        //     // this.setPosition(this.x, this.y - 10)
        // }
        /*
        
        */
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
        // handle movement sideway
        if (recordedKeys.left === true)
        {
            // console.log("l")
            this.body.velocity.x = -this.MovementSpeed
        } else if (recordedKeys.right === true)
        {
            // console.log("r")
            this.body.velocity.x = this.MovementSpeed
        }
        // handle jump and crouch
        if (recordedKeys.crouch === true)
        {
            // console.log("d")
            this.idle = false;
            this.isCrouching = true
        } else if (recordedKeys.jump === true 
            && ('touching' in this.body) && this.body.blocked.down)
        {
            // console.log("u")
            this.jumpCooldown = 12
        }else{
            this.idle = true;
            this.isCrouching = false;
        }
        // handle jump in time
        if(this.jumpCooldown > 0){
            this.jumpCooldown -= 1
            this.body.velocity.y = -400
        }
    }
}