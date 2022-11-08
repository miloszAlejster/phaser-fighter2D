import Phaser from 'phaser'
import Game from './scenes/game';
import BootScene from './scenes/BootScene';
import PreloaderScene from './scenes/PreloaderScene';
import sceneKeys from './consts/sceneKeys'
import TitleScreen from './scenes/TitleScreen';
import MenuScene from './scenes/MenuScene';
import OptionsScene from './scenes/OptionsScene';
import CreditsScene from './scenes/CreditsScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 381,
	height: 213,
	backgroundColor: 0x000000,
	physics: { 
		default: 'arcade',
		arcade: {
			gravity: { y: 9000 },
			debug: false
		}
	},
	zoom: 1.9
}
const game = new Phaser.Game(config);

game.scene.add(sceneKeys.Game, Game)
game.scene.add(sceneKeys.BootScene, BootScene)
game.scene.add(sceneKeys.PreloaderScene, PreloaderScene)
game.scene.add(sceneKeys.TitleScreen, TitleScreen)
game.scene.add(sceneKeys.MenuScene, MenuScene)
game.scene.add(sceneKeys.OptionsScene, OptionsScene)
game.scene.add(sceneKeys.CreditsScene, CreditsScene)
game.scene.start(sceneKeys.BootScene)
