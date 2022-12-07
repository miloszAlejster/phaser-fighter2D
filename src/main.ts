import Phaser from 'phaser'
import BootScene from './scenes/BootScene';
import PreloaderScene from './scenes/PreloaderScene';
import sceneKeys from './consts/sceneKeys'
import TitleScreen from './scenes/TitleScreen';
import MenuScene from './scenes/MenuScene';
import OptionsScene from './scenes/OptionsScene';
import CreditsScene from './scenes/CreditsScene';
import GameAscii from './scenes/GameAscii';
import GameGraphic from './scenes/GameGraphic';
import UIScene from './scenes/UIScene';
import SceneKeys from './consts/sceneKeys';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.NONE,
		width: 381,
		height: 213,
	},
	backgroundColor: 0x000000,
	zoom: 1.9
}
const game = new Phaser.Game(config);

game.scene.add(sceneKeys.GameAscii, GameAscii);
game.scene.add(sceneKeys.GameGraphic, GameGraphic);
game.scene.add(sceneKeys.BootScene, BootScene);
game.scene.add(sceneKeys.PreloaderScene, PreloaderScene);
game.scene.add(sceneKeys.TitleScreen, TitleScreen);
game.scene.add(sceneKeys.MenuScene, MenuScene);
game.scene.add(sceneKeys.OptionsScene, OptionsScene);
game.scene.add(sceneKeys.CreditsScene, CreditsScene);
game.scene.add(SceneKeys.UIScene, UIScene);
game.scene.start(sceneKeys.BootScene);
