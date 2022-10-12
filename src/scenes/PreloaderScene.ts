import Phaser from "phaser";
import SceneKeys from '../consts/sceneKeys'

export default class PreloaderScene extends Phaser.Scene{
    constructor(){
        super('preloader')
    }
    preload(){

    }
    create(){
        this.scene.start(SceneKeys.Game)
    }
}