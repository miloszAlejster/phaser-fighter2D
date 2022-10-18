import Phaser from "phaser";
import * as Types from "../types/index"
import * as SpritePlayer from "../consts/spritesPlayer"
import Punch from "./punch"

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
        if("offset" in this.body)
            this.body.offset.x = 12
        // it say that width is readonly but nor really?
        //@ts-ignore
        this.body.width = this.width - 24
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
    punch: Punch
    firstCrouch: boolean = true
    lastTimePunch: number = 0
    punchCooldown: number = 400// ms
    isDonePunch: boolean|undefined = undefined
    
    update(time: number, delta: number): void{
        this.recordKeys()
        this.handlePlayerMovement(time)
        this.handlePlayerSize()
        this.handleAttack()
        this.handlePunchAttack(time, delta)
        console.log("pX ",this.x," pY ",this.y)
    }
    handleAttack(){}
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
    handlePunchAttack(time: number, delta: number){
        const cooldown = time - this.lastTimePunch < this.punchCooldown
        // init punch attack
        if((!this.punch || !this.punch.scene) && this.recordedKeys.punch && !cooldown){
            this.createPunch()
            this.isDonePunch = false
            this.lastTimePunch = time
        }
        // update punch attack
        if(this.isDonePunch === false){
            this.punch.update(time, delta);
        } 
        // destroy punch attack
        // TODO: change name of variables to fit it
        if(this.isDonePunch === false && !cooldown){
            this.punch.destroy()
            this.isDonePunch = undefined
        }
    }
    createPunch(){
        this.punch = new Punch({
            scene: this.scene,
            x: this.x,
            y: this.y - 30,
            text: 'o',
            style: {
                fontSize: 10
            }
        }, this.lastHDir)
        if("setSize" in this.punch.body)
            this.punch.body.setSize(this.punch.width, this.punch.height, true)
    }
    handlePlayerSize(){
        if(this.idle){
            this.text = SpritePlayer.idle
            if("offset" in this.body)
                this.body.offset.y = 10
            //@ts-ignore
            this.body.height = this.height - 12
            // reset
            this.firstCrouch = true
        }else if(this.isCrouching){
            this.text = SpritePlayer.crouch
            if("offset" in this.body)
                this.body.offset.y = 29
            //@ts-ignore
            this.body.height = this.height-31
            // reset
            if(this.firstCrouch){
                this.firstCrouch = false
            }
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