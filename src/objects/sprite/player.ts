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
    crouchCooldown: number = 700
    punchCooldown: number = 500
    kickCooldown: number = 600
    blockCooldown: number = 1000
    // durations
    crouchDuration: number = 200
    punchDuration: number = 100
    kickDuration: number = 100
    blockDuration: number = 100
    // colldown flags
    canPunch: boolean = true;
    canCrouch: boolean = true;
    // action flags
    isPunch: boolean = false
    isKick: boolean = false
    isBlock: boolean = false
    isKnock: boolean = false
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
    currentShape: Phaser.GameObjects.Shape
    update(){        
        if(this.dead === true) return;
        this.setcurrentShape();
        this.setAngularVelocity(0);
        this.recordKeys();
        this.handlePlayerMovement();
        this.handlePlayerDeath();
        this.handleKnockout();
        this.handleAnimation();
    }
    setcurrentShape(){
        if(this.lastHDir === 'r'){
            this.currentShape = this.shapes.shapesPlayer;
        }else if(this.lastHDir === 'l'){
            this.currentShape = this.shapes.shapesPlayerFlip;
        }
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
    setShape(shape: string){
        // take params beforehead
        var sx = this.x;
        var sy = this.y;
        var sav = 0;
        if('angularVelocity' in this.body) sav = this.body.angularVelocity;
        var sv = this.body.velocity;
        // set shape
        this.setBody(this.currentShape[shape]);
        // pass previous params
        this.setPosition(sx, sy);
        this.setVelocity(sv.x, sv.y);
        this.setAngularVelocity(sav);
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
            this.setShape('idle_air');
            this.play('idle_a1', true);
        }
        if(this.isIdleGround === true){
            this.isIdleAir = false;
            this.setShape('idle_ground');
            this.play('idle_g1', true);
        }
        // movement
        if(this.animMove.right === true){
            if(this.lastHDir === 'r'){
                this.setShape('walk_front');
                this.play('walk_f1', true);
            }else if(this.lastHDir === 'l'){
                this.setShape('walk_back');
                this.play('walk_b1', true);
            }
            this.setObjFalse(this.animMove);
        }else if(this.animMove.left === true){
            if(this.lastHDir === 'r'){
                this.setShape('walk_back');
                this.play('walk_b1', true);
            }else if(this.lastHDir === 'l'){
                this.setShape('walk_front');
                this.play('walk_f1', true);
            }
            this.setObjFalse(this.animMove);
        }
        // punch
        // TODO: fix => shows only one frame
        if(this.isPunch === true){
            if(this.isAir === true){
                this.setShape('punch_air');
                this.play('punch_a1', true);
            }else if(this.isAir === false){
                this.setShape('punch_ground');
                this.play('punch_g1', true);
            }
        }
        // crouch
        // TODO: fix => shows only one frame
        if(this.isCrouching === true){
            this.setShape('crouch');
            this.play('crouch_1', true);
        }
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
            if(this.recordedKeys.crouch === true && this.isAir === false && this.canCrouch){
                this.isCrouching = true;
                this.canCrouch = false;
                this.y += 15;
                this.scene.time.addEvent({delay:this.crouchDuration, callback: this.setCrouch, callbackScope: this});
                this.scene.time.addEvent({delay:this.crouchCooldown, callback: this.setCooldownCrouch, callbackScope: this});
            }
            // punch
            if(this.recordedKeys.punch === true && this.canPunch){
                this.isPunch = true;
                this.canPunch = false;
                this.scene.time.addEvent({delay:this.punchDuration, callback: this.setPunch, callbackScope: this});
                this.scene.time.addEvent({delay:this.punchCooldown, callback: this.setCooldownPunch, callbackScope: this})
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
    setPunch(){
        this.isPunch = false;
    }
    setCooldownPunch(){
        this.canPunch = true;
    }
    setCooldownCrouch(){
        this.canCrouch = true;
    }
}