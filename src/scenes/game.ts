import Phaser from "phaser";
import Player from "~/objects/player";

export default class Game extends Phaser.Scene{
    constructor(){
        super('game');
    }
    player: Phaser.GameObjects.Text
    create(){
        // player
        this.player = new Player({
            scene: this,
            x: 100,
            y: this.scale.height - 53.5,
            text: '   \n\n',
            style: {
                fontSize: 30
            }
        }).setOrigin(0.5)
        const worldWidth = this.scale.width * 1.2
        const worldHeigth = this.scale.height - 10
        this.physics.world.setBounds(0, 0, worldWidth, worldHeigth)
        this.physics.world.setBoundsCollision();
        // const camera = this.cameras.main;
        // camera.setBounds(0, 0, worldWidth, worldHeigth);
        // camera.startFollow(this.player)
    }
    update(time: number, delta: number): void {
        this.player.update(time, delta)
    }
}