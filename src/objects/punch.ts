import Phaser from "phaser";

export default class Punch extends Phaser.GameObjects.Text{
    constructor(config){
        super(config.scene, config.x,config.y, config.text, config.style)
    }
    update(time: number, delta: number): void {
        
    }
}