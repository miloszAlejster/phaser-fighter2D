import Phaser from "phaser";
// eslint-disable-next-line no-unused-vars
import * as Types from "../types/index"
import * as SpritePlayer from "../consts/spritesPlayer"
import Punch from "./punch"
import Kick from "./kick";

export default class Player extends Phaser.GameObjects.Text{
    constructor(config, id: number){
        super(config.scene, config.x, config.y, config.text, config.style)
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.id = id
        if('setCollideWorldBounds' in this.body){
            this.body.setCollideWorldBounds(true)
        }
        if("setOffset" in this.body){
            this.body.setOffset(12, 10)
        }
        if("setSize" in this.body){
            this.body.setSize(this.width - 24, this.height - 12)
        }
        if(id === 1){
            this.keys  = {
                left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
                jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                punch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
                kick: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
            }
            this.lastHDir = "r"
        }else if(id === 2){
            this.keys  = {
                left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
                right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
                jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                punch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N),
                kick: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
            }
            this.lastHDir = "l"
        }
    }
    MovementSpeed: number = 150
    keys: Types.keysTypes
    recordedKeys: Types.keyBool
    jumpCooldown: number = 0
    idle: boolean = true
    isCrouching: boolean = false
    lastHDir: string
    lastVDir: string = "f"
    punch: Punch
    kick: Kick
    firstCrouch: boolean = true
    punchCooldown: number = 300// ms
    kickCooldown: number = 250// ms
    isPunch: boolean = false
    isKick: boolean = false
    id: number
    hp: number = 100
    dead: boolean = false
    update(): void{
        if(this.dead === true) return
        this.recordKeys()
        this.handlePlayerMovement()
        this.handlePlayerSize()
        this.handlePunchAttack()
        this.handleKickAttack()
        this.handlePlayerDeath()
    }
    handlePlayerDeath(){
        if(this.hp <= 0){
            this.destroy()
            this.destroyPunch()
            this.destroyKick()
            this.dead = true
        }
    }
    recordKeys(){
        // check input
        this.recordedKeys = {
            left: this.keys.left.isDown,
            right: this.keys.right.isDown,
            jump: this.keys.jump.isDown,
            crouch: this.keys.crouch.isDown,
            punch: this.keys.punch.isDown,
            kick: this.keys.kick.isDown
        };
    }
    handleKickAttack(){
        // init kick attack
        if(this.recordedKeys.kick && this.isKick === false){
            this.createKick()
            this.isKick = true;
            this.scene.time.addEvent({delay:this.kickCooldown, callback: this.destroyKick, callbackScope: this})
        }
    }
    handlePunchAttack(){
        // init punch attack
        if(this.recordedKeys.punch && this.isPunch === false){
            this.createPunch()
            this.isPunch = true;
            this.scene.time.addEvent({delay:this.punchCooldown, callback: this.destroyPunch, callbackScope: this})
        }
    }
    destroyKick(){
        if(this.kick){
            this.kick.destroy()
        }
        this.isKick = false;
    }
    // destroy punch attack
    destroyPunch(){
        if(this.punch){
            this.punch.destroy()
        }
        this.isPunch = false;
    }
    createKick(){
        this.kick = new Kick({
            scene: this.scene,
            x: -10,
            y: -10,
            text: 'o',
            style: {
                fontSize: 20
            }
        }, 
        this.lastHDir, 
        {x: this.x, y: this.y},
        this.isCrouching,
        this
        ).setOrigin(0.5)
    }
    createPunch(){
        this.punch = new Punch({
            scene: this.scene,
            x: -10,
            y: -10,
            text: 'o',
            style: {
                fontSize: 20
            }
        }, 
        this.lastHDir, 
        {x: this.x, y: this.y},
        this.isCrouching,
        this
        ).setOrigin(0.5)
    }
    handlePlayerSize(){
        if(this.idle){
            if(this.isPunch){
                if(this.lastHDir === "r")
                    this.text = SpritePlayer.punchRight
                else if (this.lastHDir === "l")
                    this.text = SpritePlayer.punchLeft
            }else if(this.isKick){
                if(this.lastHDir === "r")
                    this.text = SpritePlayer.kickRight
                else if (this.lastHDir === "l")
                    this.text = SpritePlayer.kickLeft
            }else{
                this.text = SpritePlayer.idle
            }
            if("offset" in this.body){
                this.body.offset.y = 10
            }
            //@ts-ignore
            this.body.height = this.height - 12
            // reset
            this.firstCrouch = true
        }else if(this.isCrouching){
            if(this.isPunch){
                if(this.lastHDir === "r")
                    this.text = SpritePlayer.punchRightCrouch
                else if (this.lastHDir === "l")
                    this.text = SpritePlayer.punchLeftCrouch
            }else if(this.isKick){
                if(this.lastHDir === "r")
                    this.text = SpritePlayer.kickRightCrouch
                else if (this.lastHDir === "l")
                    this.text = SpritePlayer.kickLeftCrouch
            }else
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
    handlePlayerMovement(){
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
            this.jumpCooldown = 13
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