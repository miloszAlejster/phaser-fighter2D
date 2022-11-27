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
        this.load.spritesheet('player_1', './sprites/player_ver_1.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('player_2', './sprites/player_ver_2.png', {frameWidth: 64, frameHeight: 64});
        this.load.on('complete', () => {
            this.scene.start(SceneKeys.MenuScene, this.settings);
        })
    }
    create(){
        this.initPlayer1Anim();
        this.initPlayer2Anim();
    }
    initPlayer1Anim(){
        const configWalkFrontP1 = {
            key: 'walk-f1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 19 ]
            })
        };
        const configWalkBackP1 = {
            key: 'walk-b1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 18 ]
            })
        };
        const configIdleGroundP1 = {
            key: 'idle-g1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 3, 4, 5 ]
            }),
            frameRate: 2,
            repeat: -1,
            yoyo: true
        };
        const configIdleAirP1 = {
            key: 'idle-a1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 6, 7 ]
            }),
            frameRate: 2,
            repeat: -1
        };
        const configCrouchP1 = {
            key: 'crouch1',
            frames: this.anims.generateFrameNumbers('player_1', {
                first: 14,
                frames: [ 14, 15 ]
            }),
            frameRate: 5
        };
        const configPunchAir1 = {
            key: 'punch-a1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 66, 43]
            }),
            frameRate: 3,
        };
        const configPunchGround1 = {
            key: 'punch-g1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 36, 37, 38]
            }),
            yoyo: true,
            frameRate: 5,
            repeat: -1
        };
        const configBlockGround1 = {
            key: 'block-g1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 54 ]
            })
        };
        const configBlockAir1 = {
            key: 'block-a1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 55 ]
            })
        };
        const configKickGround1 = {
            key: 'kick-g1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 45 ]
            })
        };
        const configKickAir1 = {
            key: 'kick-a1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 48, 49 ]
            }),
            frameRate: 10,
            repeat: -1
        };
        const configKnockback1 = {
            key: 'knockback1',
            frames: this.anims.generateFrameNumbers('player_1', {
                frames: [ 57, 94, 59 ]
            }),
            frameRate: 10,
        };
        this.anims.create(configWalkFrontP1);
        this.anims.create(configWalkBackP1);
        this.anims.create(configIdleGroundP1);
        this.anims.create(configIdleAirP1);
        this.anims.create(configCrouchP1);
        this.anims.create(configPunchAir1);
        this.anims.create(configPunchGround1);
        this.anims.create(configBlockGround1);
        this.anims.create(configBlockAir1);
        this.anims.create(configKickGround1);
        this.anims.create(configKickAir1);
        this.anims.create(configKnockback1);
    }
    initPlayer2Anim(){
        const configWalkFrontP2 = {
            key: 'walk-f2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 19 ]
            })
        };
        const configWalkBackP2 = {
            key: 'walk-b2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 18 ]
            })
        };
        const configIdleGroundP2 = {
            key: 'idle-g2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 3, 4, 5 ]
            }),
            frameRate: 2,
            repeat: -1,
            yoyo: true
        };
        const configIdleAirP2 = {
            key: 'idle-a2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 6, 7 ]
            }),
            frameRate: 2,
            repeat: -1
        };
        const configCrouchP2 = {
            key: 'crouch2',
            frames: this.anims.generateFrameNumbers('player_2', {
                first: 14,
                frames: [ 14, 15 ]
            }),
            frameRate: 5
        };
        const configPunchAir2 = {
            key: 'punch-a2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 66, 43]
            }),
            frameRate: 3,
        };
        const configPunchGround2 = {
            key: 'punch-g2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 36, 37, 38]
            }),
            yoyo: true,
            frameRate: 5,
            repeat: -1
        };
        const configBlockGround2 = {
            key: 'block-g2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 54 ]
            })
        };
        const configBlockAir2 = {
            key: 'block-a2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 55 ]
            })
        };
        const configKickGround2 = {
            key: 'kick-g2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 45 ]
            })
        };
        const configKickAir2 = {
            key: 'kick-a2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 48, 49 ]
            }),
            frameRate: 10,
            repeat: -1
        };
        const configKnockback2 = {
            key: 'knockback2',
            frames: this.anims.generateFrameNumbers('player_2', {
                frames: [ 57, 94, 59 ]
            }),
            frameRate: 10,
        };
        this.anims.create(configWalkFrontP2);
        this.anims.create(configWalkBackP2);
        this.anims.create(configIdleGroundP2);
        this.anims.create(configIdleAirP2);
        this.anims.create(configCrouchP2);
        this.anims.create(configPunchAir2);
        this.anims.create(configPunchGround2);
        this.anims.create(configBlockGround2);
        this.anims.create(configBlockAir2);
        this.anims.create(configKickGround2);
        this.anims.create(configKickAir2);
        this.anims.create(configKnockback2);
    }
}