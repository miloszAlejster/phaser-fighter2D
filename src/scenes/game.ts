import Phaser from "phaser";
import Player from "~/objects/player";

export default class Game extends Phaser.Scene{
    constructor(){
        super('game');
    }
    player: Phaser.GameObjects.Text
    player2: Phaser.GameObjects.Text
    create(){
        // player1
        this.player = new Player({
            scene: this,
            x: 100,
            y: this.scale.height - 51.5,
            text: '   \n\n',
            style: {
                fontSize: 30
            }
        }, 1).setOrigin(0.5)
        // player2
        this.player2 = new Player({
            scene: this,
            x: this.scale.width-100,
            y: this.scale.height - 51.5,
            text: '   \n\n',
            style: {
                fontSize: 30
            }
        }, 2).setOrigin(0.5)
        const worldWidth = this.scale.width
        const worldHeigth = this.scale.height - 10
        this.physics.world.setBounds(0, 0, worldWidth, worldHeigth)
        this.physics.world.setBoundsCollision();
        this.physics.add.collider(this.player, this.player2)
    }
    update(time: number, delta: number): void {
        this.player.update(time, delta)
        this.player2.update(time, delta)
    }
}