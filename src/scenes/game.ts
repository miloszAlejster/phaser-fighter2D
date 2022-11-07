import Phaser from "phaser";
import Player from "~/objects/player";
import SceneKeys from "~/consts/sceneKeys";

export default class Game extends Phaser.Scene{
    constructor(){
        super('game');
    }
    player: Player
    player2: Player
    playerHp: Phaser.GameObjects.Text
    player2Hp: Phaser.GameObjects.Text
    player1Name: Phaser.GameObjects.Text
    player2Name: Phaser.GameObjects.Text
    overText: Phaser.GameObjects.Text
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
        this.player1Name = this.add.text(80, 10, "Player 1").setOrigin(0.5)
        this.player2Name = this.add.text(this.scale.width-80, 10, "Player 2").setOrigin(0.5)
        this.playerHp = this.add.text(33, 20, "||||||||||")
        this.player2Hp = this.add.text(253, 20, "||||||||||")
        this.overText = this.add.text(this.scale.width/2, this.scale.height/2-20, "", {fontSize: '40px'}).setOrigin(0.5)
    }
    update(): void {
        this.player.update()
        this.player2.update()
        this.handleGuiHp()
        this.handlePlayersDir()
        this.handleOver()
    }
    handleOver(){
        // TODO: change it to make it prettier
        const p1Death: boolean = this.player.hp <= 0
        const p2Death: boolean = this.player2.hp <= 0;
        if(p1Death || p2Death){
            if(p1Death){
                // player 2 won
                this.overText.setText("Player 2 WON")
            }else if(p2Death){
                // player 1 won
                this.overText.setText("Player 1 WON")
            }
            this.player1Name.destroy()
            this.player2Name.destroy()
            this.playerHp.destroy()
            this.player2Hp.destroy()
            this.time.addEvent({delay:4000, callback: this.handleChangeScene, callbackScope: this} )
        }
    }
    handleChangeScene(){
        this.scene.start(SceneKeys.TitleScreen)
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