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
        super('preloader');
    }
    preload(){
        // player 1
        this.load.atlas('player1', 'atlases/player_1.png', 'atlases/player_1.json');
        this.load.json('player1_shapes', 'shapes/player1_shapes.json');
        this.load.json('player1_shapes_flip', 'shapes/player1_shapes_flip.json');
        // player 2
        // TODO
        this.load.on('complete', () => {
            this.scene.start(SceneKeys.MenuScene, this.settings);
        })
    }
    create(){
        this.initAnimPlayer_1();
    }
    initAnimPlayer_1(){
        let frameNames: Phaser.Types.Animations.AnimationFrame[];
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/front/', suffix: '.png'
        });
        this.anims.create({key: 'walk_f1', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/back/', suffix: '.png'
        });
        this.anims.create({key: 'walk_b1', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'idle/air/', suffix: '.png'
        });
        this.anims.create({key: 'idle_a1', frames: frameNames, frameRate: 3, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'idle/ground/', suffix: '.png'
        });
        this.anims.create({key: 'idle_g1', frames: frameNames, frameRate: 3, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'crouch/', suffix: '.png'
        });
        this.anims.create({key: 'crouch_1', frames: frameNames, frameRate: 10});

        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'block/', suffix: '.png'
        });
        this.anims.create({key: 'block_1', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'kick/air/', suffix: '.png'
        });
        this.anims.create({key: 'kick_a1', frames: frameNames, frameRate: 10, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'kick/ground/', suffix: '.png'
        });
        this.anims.create({key: 'kick_g1', frames: frameNames});
        
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'knockback/', suffix: '.png'
        });
        this.anims.create({key: 'knockback_1', frames: frameNames, frameRate: 10});
        
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/air/', suffix: '.png'
        });
        this.anims.create({key: 'punch_a1', frames: frameNames, frameRate: 10, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/ground/', suffix: '.png'
        });
        this.anims.create({key: 'punch_g1', frames: frameNames, frameRate: 10, repeat: -1});
    }
}