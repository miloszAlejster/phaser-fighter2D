import Phaser from "phaser";
import SceneKeys from "~/consts/sceneKeys";
import * as Types from "~/types/index"

export default class TitleScreen extends Phaser.Scene{
    mainText: Phaser.GameObjects.Text
    subText: Phaser.GameObjects.Text
    readText: Phaser.GameObjects.Text
    settings: Types.gameSettings
    init(settings){
        this.settings = settings
    }
    create(){
        this.mainText = this.add.text(this.scale.width/2, this.scale.height/2, 'Fighting Game', { fontSize: '30px'}).setOrigin(0.5)
        this.subText = this.add.text(this.scale.width/2, this.scale.height/2 + 50, 'Press ENTER to start', { fontSize: '10px'}).setOrigin(0.5)
        this.input.keyboard.once("keydown-ENTER", ()=>{
            this.time.addEvent({delay:1000, callback: this.handleReady, callbackScope: this})
            this.readText = this.add.text(this.scale.width/2, this.scale.height/2, 'Get Ready', { fontSize: '40px'}).setOrigin(0.5)
            this.mainText.destroy()
            this.subText.destroy()
        })
        this.input.keyboard.once("keydown-ESC", ()=>{
            this.scene.start(SceneKeys.MenuScene, this.settings)
        })
    }
    handleReady(){
        this.time.addEvent({delay:700, callback: this.handleNextScene, callbackScope: this})
        this.add.text(this.scale.width/2, this.scale.height/2, 'GO', { fontSize: '40px'}).setOrigin(0.5)
        this.readText.destroy()
    }
    handleNextScene(){
        this.scene.start(SceneKeys.Game, this.settings)
    }
}