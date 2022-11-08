import Phaser from "phaser";
import SceneKeys from "~/consts/sceneKeys";
export default class OptionsScene extends Phaser.Scene{
    create(){
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start(SceneKeys.MenuScene)
        })
    }
}