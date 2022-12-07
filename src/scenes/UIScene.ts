import Phaser from "phaser";
import SceneKeys from "~/consts/sceneKeys";

class HealthBar {
    bar: Phaser.GameObjects.Graphics;
    x: number;
    y: number;
    value: number;
    p: number;
    constructor(scene, x, y, value){
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.x = x;
        this.y = y;
        this.value = value;
        this.p = 76 / this.value;
        this.draw();
        scene.add.existing(this.bar);
    }
    decrease(amount){
        this.value -= amount;
        if (this.value < 0){
            this.value = 0;
        }
        this.draw();
        return (this.value === 0);
    }
    draw(){
        this.bar.clear();
        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);
        //  Health
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);
        if(this.value < 30){
            this.bar.fillStyle(0xff0000);
        }else{
            this.bar.fillStyle(0x00ff00);
        }
        var d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }
    destroy(){
        this.bar.clear();
    }
}

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
    hp1: HealthBar;
    hp2: HealthBar;
    defhp1: number;
    defhp2: number;
    create(){
        this.game = this.scene.get(SceneKeys.GameGraphic);
        this.player1Name = this.add.text(381/4*1, 10, "Player 1").setOrigin(0.5).setScrollFactor(0);
        this.player2Name = this.add.text(381/4*3, 10, "Player 2").setOrigin(0.5).setScrollFactor(0);
        this.overText = this.add.text(this.scale.width/2, this.scale.height/2-20, "", {fontSize: '40px'}).setOrigin(0.5).setScrollFactor(0);
        // end game
        this.input.keyboard.on('keydown-ESC', () => {
            this.handleChangeScene();
        })
        this.hp1 = new HealthBar(this, 381/4*1-40, 20, this.game.settings.hp1);
        this.hp2 = new HealthBar(this, 381/4*3-40, 20, this.game.settings.hp2);
    }
    update(){
        this.handleOver();
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
            // hide ui
            this.player1Name.destroy();
            this.player2Name.destroy();
            this.hp1.destroy();
            this.hp2.destroy();
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