import Phaser from "phaser";
import SceneKeys from '../consts/sceneKeys';

export default class BootScene extends Phaser.Scene{
    constructor(){
        super('boot')
    }
    create(){
        this.scene.start(SceneKeys.PreloaderScene)
    }
}