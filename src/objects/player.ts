import Phaser from "phaser";
import * as Types from "../types/index"
import * as SpritePlayer from "../consts/spritesPlayer"
import Punch from "./punch"

export default class Player extends Phaser.GameObjects.Text{
    constructor(config, id: number){
        super(config.scene, config.x, config.y, config.text, config.style)
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.id = id
        // Type Guard
        if('setCollideWorldBounds' in this.body){
            this.body.setCollideWorldBounds(true)
        }
        if("offset" in this.body)
            this.body.offset.x = 12
        if("offset" in this.body)
            this.body.offset.y = 10
        // it say that width is readonly but nor really?
        //@ts-ignore
        this.body.height = this.height - 12
        //@ts-ignore
        this.body.width = this.width - 24
        if(id === 1){
            this.keys  = {
                left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
                jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                punch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
            }
            this.lastHDir = "r"
        }else if(id === 2){
            this.keys  = {
                left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
                right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
                jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                punch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N)
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
    firstCrouch: boolean = true
    lastTimePunch: number = 0
    punchCooldown: number = 500// ms
    isPunch: boolean|undefined = undefined
    id: number
    
    update(time: number, delta: number): void{
        this.recordKeys()
        this.handlePlayerMovement(time)
        this.handlePlayerSize()
        // this.handleAttack()
        this.handlePunchAttack(time, delta)
    }
    // handleAttack(){}
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
        // init punch attack
        // console.log("1 ",(!this.punch || !this.punch.scene)," 2 ",this.recordedKeys.punch," 3 ",this.isPunch === undefined)
        if((!this.punch || !this.punch.scene) && this.recordedKeys.punch && this.isPunch === undefined){
            // console.log("init")
            this.createPunch()
            this.lastTimePunch = time
            this.isPunch = time - this.lastTimePunch < this.punchCooldown
        }
        // console.log(this.isPunch)
        // update punch attack
        if(this.isPunch === true){
            // console.log("update")
            this.punch.update(time, delta);
            this.isPunch = time - this.lastTimePunch < this.punchCooldown
            return
        } 
        // destroy punch attack
        // TODO: change name of variables to fit it
        if(this.isPunch == false){
            // console.log("destroy")
            this.punch.destroy()
            this.isPunch = undefined
        }
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
            if(this.isPunch === true && this.lastHDir === "r")
                this.text = SpritePlayer.punchRight
            else if (this.isPunch === true && this.lastHDir === "l")
                this.text = SpritePlayer.punchLeft
            else
                this.text = SpritePlayer.idle
            if("offset" in this.body)
                this.body.offset.y = 10
            //@ts-ignore
            this.body.height = this.height - 12
            // reset
            this.firstCrouch = true
        }else if(this.isCrouching){
            if(this.isPunch === true && this.lastHDir === "r")
                this.text = SpritePlayer.punchRightCrouch
            else if (this.isPunch === true && this.lastHDir === "l")
                this.text = SpritePlayer.punchLeftCrouch
            else
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