import Phaser from "phaser";
import PlayerAscii from "../objects/ascii/player";
import SceneKeys from "../consts/sceneKeys";
import * as Types from "../types/index"
import * as Colors from "../consts/colors"

export default class GameAscii extends Phaser.Scene{
    constructor(){
        super({
            key: 'game-ascii',
            physics: {
                default: "arcade",
                arcade: { gravity: { y: 9000 } }
            }
        });
    }
    playerAscii1: PlayerAscii
    playerAscii2: PlayerAscii
    player1Hp: Phaser.GameObjects.Text
    player2Hp: Phaser.GameObjects.Text
    player1Name: Phaser.GameObjects.Text
    player2Name: Phaser.GameObjects.Text
    overText: Phaser.GameObjects.Text
    settings: Types.gameSettings
    init(settings: Types.gameSettings){
        this.settings = settings
    }
    create(){
        // player1
        this.playerAscii1 = new PlayerAscii({
            scene: this,
            x: 100,
            y: this.scale.height - 51.5,
            text: '   \n\n',
            style: {
                fontSize: 30
            }
        }, 1, this.settings.hp1, this.settings.immortality).setOrigin(0.5)
        // player2
        this.playerAscii2 = new PlayerAscii({
            scene: this,
            x: this.scale.width-100,
            y: this.scale.height - 51.5,
            text: '   \n\n',
            style: {
                fontSize: 30
            }
        }, 2, this.settings.hp2, this.settings.immortality).setOrigin(0.5)
        this.playerAscii1.enemy = this.playerAscii2;
        this.playerAscii2.enemy = this.playerAscii1;
        const worldWidth = this.scale.width
        const worldHeigth = this.scale.height - 10
        this.physics.world.setBounds(0, 0, worldWidth, worldHeigth)
        this.physics.world.setBoundsCollision();
        this.physics.add.collider(this.playerAscii1, this.playerAscii2)
        //GUI
        this.player1Name = this.add.text(80, 10, "Player 1").setOrigin(0.5).setColor(Colors.default.p1Color)
        this.player2Name = this.add.text(this.scale.width-80, 10, "Player 2").setOrigin(0.5).setColor(Colors.default.p2Color)
        this.player1Hp = this.add.text(33, 20, "||||||||||")
        this.player2Hp = this.add.text(253, 20, "||||||||||")
        this.overText = this.add.text(this.scale.width/2, this.scale.height/2-20, "", {fontSize: '40px'}).setOrigin(0.5)
        // end game
        this.input.keyboard.on('keydown-ESC', () => {
            this.handleChangeScene()
        })
    }
    update(): void {
        this.playerAscii1.update()
        this.playerAscii2.update()
        this.handleGuiHp()
        this.handlePlayersDir()
        this.handleOver()
    }
    handleOver(){
        // TODO: change it to make it prettier
        const p1Death: boolean = this.playerAscii1.hp <= 0
        const p2Death: boolean = this.playerAscii2.hp <= 0;
        if(p1Death || p2Death){
            if(p1Death){
                this.overText.setText("Player 2 WON")
            }else if(p2Death){
                this.overText.setText("Player 1 WON")
            }
            this.player1Name.destroy()
            this.player2Name.destroy()
            this.player1Hp.destroy()
            this.player2Hp.destroy()
            this.time.addEvent({delay:4000, callback: this.handleChangeScene, callbackScope: this} )
        }
    }
    handleChangeScene(){
        this.scene.start(SceneKeys.TitleScreen)
    }
    handlePlayersDir(){
        if(this.playerAscii1.x > this.playerAscii2.x){
            this.playerAscii1.lastHDir = "l"
            this.playerAscii2.lastHDir = "r"
        }else {
            this.playerAscii1.lastHDir = "r"
            this.playerAscii2.lastHDir = "l"
        }
    }
    handleGuiHp(){
        let hp1: string = "", hp2: string = ""
        const difHp1 = this.playerAscii1.hp > 100 ? Math.abs(this.playerAscii1.hp - 100) : 0;
        const difHp2 = this.playerAscii2.hp > 100 ? Math.abs(this.playerAscii2.hp - 100) : 0;
        // Player 1
        for(let i = 0; i < (this.playerAscii1.hp - difHp1)/10; i++){
            hp1 = hp1 + "|"
        }
        if(this.playerAscii1.hp > 100){
            hp1 = hp1 + "\n"
            for(let i = 0; i < (this.playerAscii1.hp/10 - 10) % 21 ; i++){
                hp1 = hp1 + "|"
            }
        }
        // Player 2
        for(let i = 0; i < (this.playerAscii2.hp - difHp2)/10; i++){
            hp2 = hp2 + "|"
        }
        if(this.playerAscii2.hp > 100){
            hp2 = hp2 + "\n"
            for(let i = 0; i < (this.playerAscii2.hp/10 - 10) % 21 ; i++){
                hp2 = hp2 + "|"
            }
        }
        this.player1Hp.text = hp1
        this.player2Hp.text = hp2
    }
}