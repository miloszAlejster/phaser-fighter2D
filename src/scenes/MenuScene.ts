import Phaser from "phaser";
import SceneKeys from "../consts/sceneKeys";
import * as Types from "../types/index"
export default class MenuScene extends Phaser.Scene{
    playText: Phaser.GameObjects.Text
    optionsText: Phaser.GameObjects.Text
    creditsText: Phaser.GameObjects.Text
    idCursor: number = 0
    isEnterPressed: boolean = false
    settings: Types.gameSettings
    init(settings){
        this.settings = settings
    }
    create(){
        this.playText = this.add.text(this.scale.width/2, this.scale.height/3-30, 'Play', { fontSize: '30px'}).setOrigin(0.5)
        this.optionsText = this.add.text(this.scale.width/2, 2*this.scale.height/3-30, 'Options', { fontSize: '30px'}).setOrigin(0.5)
        this.creditsText = this.add.text(this.scale.width/2, this.scale.height-30, 'Credits', { fontSize: '30px'}).setOrigin(0.5)
        this.input.keyboard.on('keydown-UP', () => {
            if(--this.idCursor <= -1){
                this.idCursor = 2
            }
        })
        this.input.keyboard.on('keydown-DOWN', () =>{
            if(++this.idCursor >= 3){
                this.idCursor = 0
            }
        })
        this.input.keyboard.on('keydown-ENTER', () => {
            this.isEnterPressed = true
        })
    }
    update(time: number, delta: number): void {
        this.handleChangeCursor()
        this.handleOptionChange()
    }
    handleOptionChange(){
        if(this.idCursor === 0 && this.isEnterPressed === true){
            // play
            this.isEnterPressed = false
            this.idCursor = 0
            this.scene.start(SceneKeys.TitleScreen, this.settings)
        }else if(this.idCursor === 1 && this.isEnterPressed === true){
            // options
            this.isEnterPressed = false
            this.idCursor = 0
            this.scene.start(SceneKeys.OptionsScene, this.settings)
        }else if(this.idCursor === 2 && this.isEnterPressed === true){
            // credits
            this.isEnterPressed = false
            this.idCursor = 0
            this.scene.start(SceneKeys.CreditsScene)
        }
    }
    handleChangeCursor(){
        if(this.idCursor == 0){
            this.playText.style.setFontSize('40px')
            this.optionsText.style.setFontSize('30px')
            this.creditsText.style.setFontSize('30px')
        }else if(this.idCursor === 1){
            this.optionsText.style.setFontSize('40px')
            this.playText.style.setFontSize('30px')
            this.creditsText.style.setFontSize('30px')
        }else if(this.idCursor === 2){
            this.creditsText.style.setFontSize('40px')
            this.playText.style.setFontSize('30px')
            this.optionsText.style.setFontSize('30px')
        }
    }
}