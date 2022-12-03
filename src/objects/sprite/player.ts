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
        if(id === 1){
            this.shapes = {
                shapesPlayer: this.scene.cache.json.get('player1_shapes'),
                shapesPlayerFlip: this.scene.cache.json.get('player1_shapes_flip')
            }
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
            // TODO: change to player 2
            this.shapes = {
                shapesPlayer: this.scene.cache.json.get('player1_shapes'),
                shapesPlayerFlip: this.scene.cache.json.get('player1_shapes_flip')
            }
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
    isAir: boolean = false
    isFalling: boolean = false
    animMove: Types.animMove = {
        punchA: false,
        punchG: false,
        kickA: false,
        kickG: false,
        block: false,
        knockback: false,
        right: false,
        left: false
    }
    isIdleAir: boolean = true;
    isIdleGround: boolean = false;
    shapes: Types.shapes
    update(){        
        if(this.dead === true) return;
        this.setAngularVelocity(0);
        this.recordKeys();
        this.handlePlayerMovement();
        this.handlePlayerDeath();
        this.handleKnockout();
        this.handleBlock();
        this.handleAnimation();
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
            this.destroy();
            this.dead = true;
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
    handleAnimation(){
        // is every value false
        const doIdle = Object.values(this.animMove).every(value => !value);
        if(doIdle === true){
            if(this.isAir === true){
                this.isIdleAir = true;
            } else if(this.isAir === false){
                this.isIdleGround = true;
            }
        }
        // idle
        if(this.isIdleAir === true){
            this.isIdleGround = false;
            // change shape
            // TODO: fix it...
            var sx = this.x;
            var sy = this.y;
            var sav = 0;
            if('angularVelocity' in this.body) sav = this.body.angularVelocity;
            var sv = this.body.velocity;
            this.setBody(this.shapes.shapesPlayer['ide_air']);
            this.setPosition(sx, sy);
            this.setVelocity(sv.x, sv.y);
            this.setAngularVelocity(sav);
            //
            this.play('idle_a1', true);
        }
        if(this.isIdleGround === true){
            this.isIdleAir = false;
            this.play('idle_g1', true);
        }
        // movement
        if(this.animMove.right === true){
            if(this.lastHDir === 'r'){
                this.play('walk_f1', true);
            }else if(this.lastHDir === 'l'){
                this.play('walk_b1', true);
            }
            this.setObjFalse(this.animMove);
        }else if(this.animMove.left === true){
            if(this.lastHDir === 'r'){
                this.play('walk_b1', true);
            }else if(this.lastHDir === 'l'){
                this.play('walk_f1', true);
            }
            this.setObjFalse(this.animMove);
        }
        // punch
        // TODO
    }
    setObjFalse(obj: Object): void{
        Object.keys(obj).forEach(key => {
            obj[key] = false;
        });
    }
    handlePlayerMovement(){
        // reset
        this.setVelocityX(0);
        this.setVelocityY(0);
        if(this.isKnock === false){
            // move front and back
            if (this.recordedKeys.left === true){
                this.setVelocityX(-this.MovementSpeed);
                this.animMove.left = true;
            } else if (this.recordedKeys.right === true){
                this.setVelocityX(this.MovementSpeed);
                this.animMove.right = true;
            }
            // get to the air
            if(this.recordedKeys.jump === true && this.isAir === false){
                this.isAir = true;
                this.setVelocityY(-3);
                this.scene.time.addEvent({delay:5000, callback: this.setFalling, callbackScope: this});
            }
            // fly up
            if(this.recordedKeys.jump === true && this.isAir === true){
                this.setVelocityY(-3);
            }
            // fly down
            if(this.recordedKeys.crouch === true && this.isAir === true){
                this.setVelocityY(3);
            }
            // crouch
            if(this.recordedKeys.crouch === true && this.isAir === false){
                this.isCrouching = true;
                this.scene.time.addEvent({delay:500, callback: this.setCrouch, callbackScope: this});
            }
        }
        // handle falling
        if(this.isFalling === true){
            this.setVelocityY(6);
        }
        // stop falling
        if(this.y > 176){
            this.isFalling = false;
            this.isAir = false;
            this.isIdleGround = true;
            this.isIdleAir = false;
        }
    }
    setFalling(){   
        this.isFalling = true;
    }
    setCrouch(){   
        this.isCrouching = false;
    }
}