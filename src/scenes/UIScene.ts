import Phaser from "phaser";
import SceneKeys from "~/consts/sceneKeys";

export default class UIClass extends Phaser.Scene{
    constructor(){
        super(SceneKeys.UIScene);
    }
    player1Hp: Phaser.GameObjects.Text;
    player2Hp: Phaser.GameObjects.Text;
    player1Name: Phaser.GameObjects.Text;
    player2Name: Phaser.GameObjects.Text;
    overText: Phaser.GameObjects.Text;
    game;
    create(){
        this.game = this.scene.get(SceneKeys.GameGraphic);
        this.player1Name = this.add.text(80, 10, "Player 1").setOrigin(0.5).setScrollFactor(0);
        this.player2Name = this.add.text(301, 10, "Player 2").setOrigin(0.5).setScrollFactor(0);
        this.player1Hp = this.add.text(33, 20, "||||||||||").setScrollFactor(0);
        this.player2Hp = this.add.text(253, 20, "||||||||||").setScrollFactor(0);
        this.overText = this.add.text(this.scale.width/2, this.scale.height/2-20, "", {fontSize: '40px'}).setOrigin(0.5).setScrollFactor(0);
        // end game
        this.input.keyboard.on('keydown-ESC', () => {
            this.handleChangeScene();
        })
    }
    update(){
        this.handleOver();
        if(this.game.player1.hp != 0 && this.game.player2.hp != 0){
            this.handleGuiHp();
        }
    }
    handleOver(){
        const p1Death: boolean = this.game.player1.hp <= 0
        const p2Death: boolean = this.game.player2.hp <= 0;
        if(p1Death || p2Death){
            if(p1Death){
                this.overText.setText("Player 2 WON").setScrollFactor(0);
            }else if(p2Death){
                this.overText.setText("Player 1 WON").setScrollFactor(0);
            }
            this.player1Name.destroy();
            this.player2Name.destroy();
            this.player1Hp.destroy();
            this.player2Hp.destroy();
            this.time.addEvent({delay:4000, callback: this.handleChangeScene, callbackScope: this});
        }
    }
    handleChangeScene(){
        this.game.scene.start(SceneKeys.TitleScreen);
        // destroy ui
        this.scene.remove("ui");
    }
    handleGuiHp(){
        let hp1: string = "", hp2: string = ""
        const difHp1 = this.game.player1.hp > 100 ? Math.abs(this.game.player1.hp - 100) : 0;
        const difHp2 = this.game.player2.hp > 100 ? Math.abs(this.game.player2.hp - 100) : 0;
        // Player 1
        for(let i = 0; i < (this.game.player1.hp - difHp1)/10; i++){
            hp1 = hp1 + "|"
        }
        if(this.game.player1.hp > 100){
            hp1 = hp1 + "\n"
            for(let i = 0; i < (this.game.player1.hp/10 - 10) % 21 ; i++){
                hp1 = hp1 + "|"
            }
        }
        // Player 2
        for(let i = 0; i < (this.game.player2.hp - difHp2)/10; i++){
            hp2 = hp2 + "|"
        }
        if(this.game.player2.hp > 100){
            hp2 = hp2 + "\n"
            for(let i = 0; i < (this.game.player2.hp/10 - 10) % 21 ; i++){
                hp2 = hp2 + "|"
            }
        }
        this.player1Hp.text = hp1;
        this.player2Hp.text = hp2;
    }
}