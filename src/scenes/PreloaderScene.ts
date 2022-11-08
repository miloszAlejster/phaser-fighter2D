import Phaser from "phaser";
import SceneKeys from '../consts/sceneKeys'
import * as Types from "types/index"

export default class PreloaderScene extends Phaser.Scene{
    settings: Types.gameSettings = {
        hp1: 100,
        hp2: 100,
        immortality: false
    }
    constructor(){
        super('preloader')
    }
    preload(){

    }
    create(){
        this.scene.start(SceneKeys.MenuScene, this.settings)
    }
}