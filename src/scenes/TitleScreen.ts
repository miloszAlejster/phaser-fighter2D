import Phaser from "phaser";

export default class TitleScreen extends Phaser.Scene{
    create(){
        this.add.text(this.scale.width/2, this.scale.height/2, 'Fighting Game', { fontSize: '30px'}).setOrigin(0.5)
        this.add.text(this.scale.width/2, this.scale.height/2 + 50, 'Press ENTER to start', { fontSize: '10px'}).setOrigin(0.5)
        this.input.keyboard.once("keydown-ENTER", ()=>{
            this.scene.start('game')
        })
    }
}