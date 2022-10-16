import Phaser from 'phaser'
import Game from './scenes/game';
import BootScene from './scenes/BootScene';
import PreloaderScene from './scenes/PreloaderScene';
import sceneKeys from './consts/sceneKeys'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 426,
	height: 240,
	backgroundColor: 0xaba8a1,
	physics: { 
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: true
		}
	},
	zoom: 1.9
}
const game = new Phaser.Game(config);

game.scene.add(sceneKeys.Game, Game)
game.scene.add(sceneKeys.BootScene, BootScene)
game.scene.add(sceneKeys.PreloaderScene, PreloaderScene)
game.scene.start(sceneKeys.BootScene)
