import Phaser from "phaser";
import Player from "~/objects/player";

export default class Game extends Phaser.Scene{
    constructor(){
        super('game');
    }
    player: Player
    player2: Player
    playerHp: Phaser.GameObjects.Text
    player2Hp: Phaser.GameObjects.Text
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
        this.player.enemy =this.player2;
        this.player2.enemy =this.player;
        const worldWidth = this.scale.width
        const worldHeigth = this.scale.height - 10
        this.physics.world.setBounds(0, 0, worldWidth, worldHeigth)
        this.physics.world.setBoundsCollision();
        this.physics.add.collider(this.player, this.player2)
        //GUI
        this.add.text(80, 10, "Player 1").setOrigin(0.5)
        this.add.text(this.scale.width-80, 10, "Player 2").setOrigin(0.5)
        this.playerHp = this.add.text(33, 20, "||||||||||")
        this.player2Hp = this.add.text(253, 20, "||||||||||")
    }
    update(): void {
        this.player.update()
        this.player2.update()
        this.handleGuiHp()
        this.handlePlayersDir()
    }
    handlePlayersDir(){
        if(this.player.x > this.player2.x){
            this.player.lastHDir = "l"
            this.player2.lastHDir = "r"
        }else {
            this.player.lastHDir = "r"
            this.player2.lastHDir = "l"
        }
    }
    handleGuiHp(){
        let hp1: string = "", hp2: string = ""
        for(let i = 0; i < this.player.hp/10; i++){
            hp1 = hp1 + "|"
        }
        for(let i = 0; i < this.player2.hp/10; i++){
            hp2 = hp2 + "|"
        }
        this.playerHp.text = hp1
        this.player2Hp.text = hp2
    }
}