import Phaser from "phaser";

export default class Punch extends Phaser.GameObjects.Text{
    constructor(config, lastHDir: String){
        super(config.scene, config.x,config.y, config.text, config.style)
        this.lastHDir = lastHDir
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
    }
    lastHDir: String
    damageText: Phaser.GameObjects.Text
    isDonePunch: boolean | boolean = false
    damage: number = 20
    isFirst: boolean = false
    isHit: boolean = false
    update(time: number, delta: number): void {
        console.log(this.text)
        this.setXY(50)
        this.handleDamage()
    }
    setXY(pos: number){
        if(this.isFirst) return
        switch(this.lastHDir){
            case "l":
                this.x = this.x - pos
                break;
            case "r":
                this.x = this.x + pos
                break;
            default:
                console.log("error in punch.setXY")
                break;
            }
        this.isFirst = true
    }
    handleDamage(){
        let x: number, y: number;
        x = Phaser.Math.Between(this.x - this.width/10 + 6, this.x + this.width/10 - 6)
        y = Phaser.Math.Between(this.y - this.width/10 + 6, this.y + this.height/10 - 6)
        this.showDamage(x, y)
    }
    showDamage(x: number, y: number){
        this.damageText = this.scene.add.text(x, y, this.damage.toString(), {fontSize: '10px'})
        this.scene.time.addEvent({delay:700, callback: this.handleTextDissapear, callbackScope: this} )
    }
    handleTextDissapear(){
        this.damageText.destroy()
        this.damageText.setVisible(false)
    }
}