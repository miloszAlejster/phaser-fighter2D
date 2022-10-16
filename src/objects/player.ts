import Phaser from "phaser";

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
    MovementSpeed: number = 120
    jumpCooldown: number = 0
    create(){

    }
    update(time: number, delta: number): void{
        this.handlePlayerMovement(time)
    }
    handlePlayerMovement(time: number){
        // reset
        if('setVelocity' in this.body)
            this.body.setVelocity(0);
        // handle movement
        if (window.recording.keys.left === true)
        {
            console.log("left")
            this.body.velocity.x = -this.MovementSpeed
        } else if (window.recording.keys.right === true)
        {
            console.log("right")
            this.body.velocity.x = this.MovementSpeed
        } else  if (window.recording.keys.jump === true && time - this.jumpCooldown >= 500)
        {
            this.jumpCooldown = time
            console.log("up")
            this.body.velocity.y = -8000
        } else if (window.recording.keys.crouch === true)
        {
            console.log("down")
        }
        //console.log('touching' in this.body && this.body.touching.down)
    }
}