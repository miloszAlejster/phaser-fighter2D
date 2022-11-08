import Phaser from "phaser";
import * as Types from "../types/index"
import * as SpritePlayer from "../consts/spritesPlayer"
import Punch from "./punch"
import Kick from "./kick";

export default class Player extends Phaser.GameObjects.Text{
    constructor(config, id: number, hp: number, immortal: boolean){
        super(config.scene, config.x, config.y, config.text, config.style)
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.id = id
        this.hp = hp
        this.immortal = immortal
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
        if(this.kick){
            this.kick.destroy()
        }
        this.isKick = false;
    }
    setCooldownPunch(){
        this.isPunchStart = false;
    }
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
        this,
        this.enemy
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
        this,
        this.enemy
        ).setOrigin(0.5)
    }
    handlePlayerSize(){
        if(this.idle){
            if(this.isBlock){
                if(this.lastHDir === "r"){
                    this.text = SpritePlayer.blockRight
                }else if (this.lastHDir === "l"){
                    this.text = SpritePlayer.blockLeft
                }
            }else if(this.isPunch){
                if(this.lastHDir === "r"){
                    this.text = SpritePlayer.punchRight
                }else if (this.lastHDir === "l"){
                    this.text = SpritePlayer.punchLeft
                }
            }else if(this.isKick){
                if(this.lastHDir === "r"){
                    this.text = SpritePlayer.kickRight
                }else if(this.lastHDir === "l"){
                    this.text = SpritePlayer.kickLeft
                }
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
            if(this.isBlock){
                if(this.lastHDir === "r"){
                    this.text = SpritePlayer.blockRightCrouch
                }else if (this.lastHDir === "l"){
                    this.text = SpritePlayer.blockLeftCrouch
                }
            }else if(this.isPunch){
                if(this.lastHDir === "r"){
                    this.text = SpritePlayer.punchRightCrouch
                }else if(this.lastHDir === "l"){
                    this.text = SpritePlayer.punchLeftCrouch
                }
            }else if(this.isKick){
                if(this.lastHDir === "r"){
                    this.text = SpritePlayer.kickRightCrouch
                }else if(this.lastHDir === "l"){
                    this.text = SpritePlayer.kickLeftCrouch
                }
            }else{
                this.text = SpritePlayer.crouch
            }
            if("offset" in this.body){
                this.body.offset.y = 29
            }
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
        if('setVelocity' in this.body){
            this.body.setVelocity(0);
        }
        if(this.isKnock === false){
            // handle movement horizontaly
            if (this.recordedKeys.left === true){
                this.body.velocity.x = -this.MovementSpeed
            } else if (this.recordedKeys.right === true){
                this.body.velocity.x = this.MovementSpeed
            }
            // handle jump and crouch
            if (this.recordedKeys.crouch === true){
                this.lastVDir = "d"
                this.idle = false;
                this.isCrouching = true
            } else if (this.recordedKeys.jump === true 
                && ('touching' in this.body) && this.body.blocked.down){
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
            this.body.velocity.y = -400
        }
    }
}