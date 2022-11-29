import Phaser from "phaser";
import * as Types from "../../types/index"
import * as Colors from "~/consts/colors"

export default class Player extends Phaser.Physics.Matter.Sprite{
    constructor(config, id: number, hp: number, immortal: boolean){
        super(config.scene.matter.world, config.x, config.y, config.texture);
		this.setTexture(config.texture)
		config.scene.add.existing(this)
        this.id = id
        this.hp = hp
        this.immortal = immortal
        // TODO: make array of anims for player one and two
        if(id === 1){
            this.keys  = {
                left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
                jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                punch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
                kick: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
                block: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G)
            }
            this.lastHDir = "r"
        }else if(id === 2){
            this.keys  = {
                left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
                right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
                jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                punch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
                kick: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
                block: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
            }   
            this.lastHDir = "l"
        }
    }
    immortal: boolean
    id: number
    hp: number
    dead: boolean = false
    enemy: Player
    MovementSpeed: number = 5
    keys: Types.keysTypes
    recordedKeys: Types.keyBool
    jumpCooldown: number = 0
    idle: boolean = true
    isCrouching: boolean = false
    lastHDir: string
    lastVDir: string = "f"
    firstCrouch: boolean = true
    // cooldowns
    punchCooldown: number = 500
    kickCooldown: number = 600
    blockCooldown: number = 1000
    // durations
    punchDuration: number = 100
    kickDuration: number = 100
    blockDuration: number = 100
    // action flags
    isPunch: boolean = false
    isKick: boolean = false
    isBlock: boolean = false
    isKnock: boolean = false
    isPunchStart: boolean = false
    isKickStart: boolean = false
    isBlockStart: boolean = false
    ratio: number = this.width / this.height
    update(){
        if(this.dead === true) return
        this.recordKeys()
        this.handlePlayerMovement()
        this.handlePlayerSize()
        this.handlePunchAttack()
        this.handleKickAttack()
        this.handlePlayerDeath()
        this.handleKnockout()
        this.handleBlock()
    }
    handleBlock(){
        if(this.isKick === false && this.isPunch === false 
                && this.isBlockStart === false && this.isBlock === false 
                && this.recordedKeys.block){
            this.isBlock = true;
            this.isBlockStart = true;
            this.scene.time.addEvent({delay:this.blockCooldown, callback: this.setCooldownBlock, callbackScope: this})
            this.scene.time.addEvent({delay:this.blockDuration, callback: this.setDurationBlock, callbackScope: this})
        }
    }
    setCooldownBlock(){
        this.isBlockStart = false;
    }
    setDurationBlock(){
        this.isBlock = false;
    }
    handleKnockout(){
        if(this.isKnock && this.body){
            if(this.lastHDir === "r"){
                this.body.velocity.x -= 300;
            }else if(this.lastHDir === "l"){
                this.body.velocity.x += 300;
            }
            this.scene.time.addEvent({delay:100, callback: this.destroyKnockout, callbackScope: this})
        }
    }
    destroyKnockout(){
        this.isKnock = false;
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
            kick: this.keys.kick.isDown,
            block: this.keys.block.isDown
        };
    }
    handleKickAttack(){
        // init kick attack
        if(this.recordedKeys.kick && this.isKick === false && this.isKickStart === false 
            && this.isPunch == false && this.isKnock == false && this.isBlock == false){
            this.createKick()
            this.isKick = true;
            this.isKickStart = true
            this.scene.time.addEvent({delay:this.kickDuration, callback: this.destroyKick, callbackScope: this})
            this.scene.time.addEvent({delay:this.kickCooldown, callback: this.setCooldownKick, callbackScope: this})
        }
    }
    handlePunchAttack(){
        // init punch attack
        if(this.recordedKeys.punch && this.isPunch === false && this.isPunchStart === false 
            && this.isKick === false && this.isKnock == false && this.isBlock == false){
            this.createPunch()
            this.isPunch = true;
            this.isPunchStart = true;
            this.scene.time.addEvent({delay:this.punchDuration, callback: this.destroyPunch, callbackScope: this})
            this.scene.time.addEvent({delay:this.punchCooldown, callback: this.setCooldownPunch, callbackScope: this})
        }
    }
    setCooldownKick(){
        this.isKickStart = false;
    }
    destroyKick(){
        
        this.isKick = false;
    }
    setCooldownPunch(){
        this.isPunchStart = false;
    }
    destroyPunch(){
        
        this.isPunch = false;
    }
    createKick(){
        
    }
    createPunch(){
        
    }
    handlePlayerSize(){
        
    }
    handlePlayerMovement(){
        // TODO: change movement so player can fly, kinda
        // reset
        this.setVelocityX(0);
        if(this.isKnock === false){
            // handle movement horizontaly
            if (this.recordedKeys.left === true){
                this.setVelocityX(-this.MovementSpeed);
            } else if (this.recordedKeys.right === true){
                this.setVelocityX(this.MovementSpeed);
            }
            // handle jump and crouch
            if (this.recordedKeys.crouch === true){
                this.lastVDir = "d"
                this.idle = false;
                this.isCrouching = true
            } else if (this.recordedKeys.jump === true){
                this.lastVDir = "u"
                this.jumpCooldown = 13
            }else{
                this.idle = true;
                this.isCrouching = false;
            }
        }
        // handle jump in time
        if(this.jumpCooldown > 0){
            this.jumpCooldown -= 1
            this.setVelocityY(-4);
        }
    }
}