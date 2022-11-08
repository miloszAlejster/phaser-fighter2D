import Phaser from "phaser";
import SceneKeys from "~/consts/sceneKeys";
export default class CreditsScene extends Phaser.Scene{
    creditText: Phaser.GameObjects.Text
    githubText: Phaser.GameObjects.Text
    create(){
        this.creditText = this.add.text(this.scale.width/2, this.scale.height/2, 'Miłosz Alejster', { fontSize: '30px'}).setOrigin(0.5)
        this.githubText = this.add.text(this.scale.width/2, this.scale.height/2+50, 'GithHub: github.com/miloszAlejster/phaser-fighter2D', { fontSize: '10px'}).setOrigin(0.5)
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start(SceneKeys.MenuScene)
        })
    }
}