import Phaser from "phaser";
import * as Types from "../types/index"
import Player from "./player";

export default class Punch extends Phaser.GameObjects.Text{
    constructor(config, lastHDir: String, playerPos: Types.position, isCrouching: boolean, player: Player){
        super(config.scene, config.x,config.y, config.text, config.style)
        this.lastHDir = lastHDir
        this.playerPos = playerPos
        this.isCrouching = isCrouching
        this.player = player
        // init physic
        this.scene.physics.world.enable(this)
        this.scene.add.existing(this)
        if("setAllowGravity" in this.body){
            this.body.setAllowGravity(false)
        }
        if("offset" in this.body){
            this.body.offset.y = 6.5
        }
        // init player and enemy
        // TODO: fix it
        //@ts-ignore
        this.body.height = this.height - 10
        if(player.id === 1){
            //@ts-ignore
            this.enemy = this.scene.player2
        }else if(player.id === 2){
            //@ts-ignore
            this.enemy = this.scene.player
        }
        // handle collision
        this.scene.physics.add.overlap(this.enemy, this, ()=>this.handleDamage(this.enemy))
        this.setSpot()
    }
    lastHDir: String
    damageText: Phaser.GameObjects.Text
    damage: number = 10
    isFirst: boolean = true
    isCrouching: boolean
    playerPos: Types.position
    player: Player
    enemy: Player
    setSpot(){
        let posX: number, posY: number
        if(this.isCrouching){
            posX=35; posY=5
        }else{
            posX=35; posY=25
        }
        switch(this.lastHDir){
            case "l":
                this.x = this.playerPos.x - posX
                break;
            case "r":
                this.x = this.playerPos.x + posX
                break;
            default:
                console.log("error in punch.setXY")
                break;
            }
        this.y = this.playerPos.y - posY
    }
    handleDamage(enemy: Player){
        if(this.isFirst === false) return
        if(this.enemy){
            let x: number, y: number, range: number = 12;
            x = Phaser.Math.Between(this.x - range, this.x + range)
            y = Phaser.Math.Between(this.y - range, this.y + range)
            enemy.hp -= this.damage
            this.showDamage(x, y)
        } 
        this.isFirst = false
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