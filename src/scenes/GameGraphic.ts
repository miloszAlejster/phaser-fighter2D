import Phaser from "phaser";
import SceneKeys from "~/consts/sceneKeys";
import * as Types from "~/types/index";
import Player from "~/objects/sprite/player"
import * as Colors from "~/consts/colors";

export default class GameGraphic extends Phaser.Scene{
    constructor(){
        super({
            key: "game-graphic",
            physics: {
                default: 'matter',
                matter: { gravity: { y: 9000 }, debug: true }
            }
        });
    }
    init(settings: Types.gameSettings){
        this.settings = settings
    }
    player1: Player;
    player2: Player;
    settings: Types.gameSettings;
    player1Hp: Phaser.GameObjects.Text;
    player2Hp: Phaser.GameObjects.Text;
    player1Name: Phaser.GameObjects.Text;
    player2Name: Phaser.GameObjects.Text;
    overText: Phaser.GameObjects.Text;
    collides: boolean = false;
    create(){
        this.matter.world.setGravity(0, 1);
        this.player1 = new Player(
            {
                scene: this,
                x: 100,
                y: 170,
                texture: 'player1',
            },
            1, 
            this.settings.hp1, 
            this.settings.immortality
        ).setOrigin(0.5);
        this.player2 = new Player(
            {
                scene: this,
                x: this.scale.width - 100,
                y: 170,
                texture: 'player2'
            }, 
            2, 
            this.settings.hp2, 
            this.settings.immortality
        ).setOrigin(0.5);
        this.player1.enemy = this.player2;
        this.player2.enemy = this.player1;
        const worldWidth = this.scale.width;
        const worldHeigth = this.scale.height - 10;
        this.matter.world.setBounds(0, 0, worldWidth, worldHeigth);
        //GUI
        this.player1Name = this.add.text(80, 10, "Player 1").setOrigin(0.5).setColor(Colors.default.p1Color);
        this.player2Name = this.add.text(this.scale.width-80, 10, "Player 2").setOrigin(0.5).setColor(Colors.default.p2Color);
        this.player1Hp = this.add.text(33, 20, "||||||||||");
        this.player2Hp = this.add.text(253, 20, "||||||||||");
        this.overText = this.add.text(this.scale.width/2, this.scale.height/2-20, "", {fontSize: '40px'}).setOrigin(0.5);
        // end game
        this.input.keyboard.on('keydown-ESC', () => {
            this.handleChangeScene();
        })
        // players collision detection
        this.matter.world.on("collisionstart", event => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                const coll1 = bodyA.gameObject instanceof Player;
                const coll2 = bodyB.gameObject instanceof Player;
                if(coll1 && coll2){
                    this.collides = true;
                }
            });
        });
        
    }
    update(time: number, delta: number): void {
        this.player1.update(this.collides);
        this.player2.update(this.collides);
        this.handleGuiHp();
        this.handlePlayersDir();
        this.handleOver()
        // reset
        this.collides = false;
    }
    handleOver(){
        const p1Death: boolean = this.player1.hp <= 0
        const p2Death: boolean = this.player2.hp <= 0;
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
        this.scene.start(SceneKeys.TitleScreen);
    }
    handlePlayersDir(){
        if(this.player1.body && this.player2.body){
            if(this.player1.x > this.player2.x){
                this.player1.flipX = true;
                this.player2.flipX = false;
                this.player1.lastHDir = "l"
                this.player2.lastHDir = "r"
            }else{
                this.player1.flipX = false;
                this.player2.flipX = true;
                this.player1.lastHDir = "r"
                this.player2.lastHDir = "l"
            }
        }
    }
    handleGuiHp(){
        let hp1: string = "", hp2: string = ""
        const difHp1 = this.player1.hp > 100 ? Math.abs(this.player1.hp - 100) : 0;
        const difHp2 = this.player2.hp > 100 ? Math.abs(this.player2.hp - 100) : 0;
        // Player 1
        for(let i = 0; i < (this.player1.hp - difHp1)/10; i++){
            hp1 = hp1 + "|"
        }
        if(this.player1.hp > 100){
            hp1 = hp1 + "\n"
            for(let i = 0; i < (this.player1.hp/10 - 10) % 21 ; i++){
                hp1 = hp1 + "|"
            }
        }
        // Player 2
        for(let i = 0; i < (this.player2.hp - difHp2)/10; i++){
            hp2 = hp2 + "|"
        }
        if(this.player2.hp > 100){
            hp2 = hp2 + "\n"
            for(let i = 0; i < (this.player2.hp/10 - 10) % 21 ; i++){
                hp2 = hp2 + "|"
            }
        }
        this.player1Hp.text = hp1
        this.player2Hp.text = hp2
    }
}