import Phaser from "phaser";
import SceneKeys from "~/consts/sceneKeys";

export default class UIClass extends Phaser.Scene{
    constructor(){
        super({
            key: SceneKeys.UIScene,
            physics: {
                default: 'matter',
                matter: { gravity: { y: 9000 }, debug: true }
            }
        });
    }
    player1Hp: Phaser.GameObjects.Text;
    player2Hp: Phaser.GameObjects.Text;
    player1Name: Phaser.GameObjects.Text;
    player2Name: Phaser.GameObjects.Text;
    overText: Phaser.GameObjects.Text;
    create(){
        const game = this.scene.get(SceneKeys.GameGraphic);
        this.player1Name = this.add.text(80, 10, "Player 1").setOrigin(0.5).setScrollFactor(0).setDepth(10);
        this.player2Name = this.add.text(301, 10, "Player 2").setOrigin(0.5).setScrollFactor(0);
        this.player1Hp = this.add.text(33, 20, "||||||||||").setScrollFactor(0);
        this.player2Hp = this.add.text(253, 20, "||||||||||").setScrollFactor(0);
        this.overText = this.add.text(this.scale.width/2, this.scale.height/2-20, "", {fontSize: '40px'}).setOrigin(0.5).setScrollFactor(0);
        console.log("here")
        game.events.on('test',  () => {
        }, this);
    }
}