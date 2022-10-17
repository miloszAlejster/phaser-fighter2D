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
        crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        punch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    }
    recordedKeys: Types.keyBool
    jumpCooldown: number = 0
    idle: boolean = true
    isCrouching: boolean = false
    lastHDir: string = "r"
    lastVDir: string = "f"
    
    update(time: number, delta: number): void{
        this.recordKeys()
        this.handlePlayerMovement(time)
        this.handlePlayerSize()
        this.handleAttack()
    }
    recordKeys(){
        // check input
        this.recordedKeys = {
            left: this.keys.left.isDown,
            right: this.keys.right.isDown,
            jump: this.keys.jump.isDown,
            crouch: this.keys.crouch.isDown,
            punch: this.keys.punch.isDown
        };
    }
    handleAttack(){
        // console.log("H ", this.lastHDir, " V ", this.lastVDir)
        
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
    }
    handlePlayerMovement(time: number){
        // reset
        if('setVelocity' in this.body)
            this.body.setVelocity(0);
        // handle movement sideway
        if (this.recordedKeys.left === true)
        {
            this.lastHDir = "l"
            this.body.velocity.x = -this.MovementSpeed
        } else if (this.recordedKeys.right === true)
        {
            this.lastHDir = "r"
            this.body.velocity.x = this.MovementSpeed
        }
        // handle jump and crouch
        if (this.recordedKeys.crouch === true)
        {
            this.lastVDir = "d"
            this.idle = false;
            this.isCrouching = true
        } else if (this.recordedKeys.jump === true 
            && ('touching' in this.body) && this.body.blocked.down)
        {
            this.lastVDir = "u"
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