import Phaser from "phaser";
import SceneKeys from "~/consts/sceneKeys";
import * as Types from "~/types/index"
export default class OptionsScene extends Phaser.Scene{
    idVCursor: number = 0
    idHCursor: string = 'default'
    // hp start p1
    p1StartHp: Phaser.GameObjects.Text
    defaultP1StartHp: number = 100
    // hp start p2
    p2StartHp: Phaser.GameObjects.Text
    defaultP2StartHp: number = 100
    // immortality
    immortality: Phaser.GameObjects.Text
    defaultImmortality: boolean = false
    defaultImmortalityText: string
    create(){
        // texts
        this.p1StartHp = this.add.text(this.scale.width/2, this.scale.height/3-30, "", { fontSize: '10px'}).setOrigin(0.5)
        this.p2StartHp = this.add.text(this.scale.width/2, 2*this.scale.height/3-30, "", { fontSize: '10px'}).setOrigin(0.5)
        this.immortality = this.add.text(this.scale.width/2, this.scale.height-30, "", { fontSize: '10px'}).setOrigin(0.5)
        // inputs
        this.input.keyboard.on('keydown-UP', () => {
            if(--this.idVCursor <= -1){
                this.idVCursor = 2
            }
        })
        this.input.keyboard.on('keydown-DOWN', () =>{
            if(++this.idVCursor >= 3){
                this.idVCursor = 0
            }
        })
        this.input.keyboard.on('keydown-LEFT', () => {
            if(this.idVCursor === 0 && this.defaultP1StartHp > 10){
                this.defaultP1StartHp -= 10
            }else if(this.idVCursor === 1 && this.defaultP2StartHp > 10){
                this.defaultP2StartHp -= 10
            }else if(this.idVCursor === 2){
                this.defaultImmortality = !this.defaultImmortality
            }
        })
        this.input.keyboard.on('keydown-RIGHT', () =>{
            if(this.idVCursor === 0 && this.defaultP1StartHp < 200){
                this.defaultP1StartHp += 10
            }else if(this.idVCursor === 1 && this.defaultP2StartHp < 200){
                this.defaultP2StartHp += 10
            }else if(this.idVCursor === 2){
                this.defaultImmortality = !this.defaultImmortality
            }
        })
        this.input.keyboard.on('keydown-ESC', () => {
            const settings: Types.gameSettings = {
                hp1: this.defaultP1StartHp,
                hp2: this.defaultP2StartHp,
                immortality: this.defaultImmortality
            }
            this.scene.start(SceneKeys.MenuScene, settings)
        })
    }
    update(time: number, delta: number): void {
        this.handleChangeCursor()
        this.handleSettingsChange()
    }
    handleSettingsChange(){
        this.p1StartHp.setText(`Heath of first player: ${this.defaultP1StartHp}`)
        this.p2StartHp.setText(`Heath of second player: ${this.defaultP2StartHp}`)
        if(this.defaultImmortality === true){
            this.defaultImmortalityText = "Yes"
        }else if(this.defaultImmortality === false){
            this.defaultImmortalityText = "No"
        }
        this.immortality.setText(`Should players be immortal: ${this.defaultImmortalityText}`)
    }
    handleChangeCursor(){
        if(this.idVCursor == 0){
            this.p1StartHp.style.setFontSize('15px')
            this.p2StartHp.style.setFontSize('10px')
            this.immortality.style.setFontSize('10px')
        }else if(this.idVCursor === 1){
            this.p2StartHp.style.setFontSize('15px')
            this.p1StartHp.style.setFontSize('10px')
            this.immortality.style.setFontSize('10px')
        }else if(this.idVCursor === 2){
            this.immortality.style.setFontSize('15px')
            this.p1StartHp.style.setFontSize('10px')
            this.p2StartHp.style.setFontSize('10px')
        }
    }
}
