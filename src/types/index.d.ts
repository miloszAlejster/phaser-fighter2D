export interface keysTypes{
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  jump: Phaser.Input.Keyboard.Key
  crouch: Phaser.Input.Keyboard.Key
  punch: Phaser.Input.Keyboard.Key
  kick: Phaser.Input.Keyboard.Key
  block: Phaser.Input.Keyboard.Key
}
export interface animMove{
  idleA: boolean
  idleG: boolean
  punch: boolean
  kick: boolean
  block: boolean
  knockback: boolean
  right: boolean
  left: boolean
}
export interface shapes{
  shapesPlayer: Phaser.GameObjects.Shape
  shapesPlayerFlip: Phaser.GameObjects.Shape
}
export interface gameSettings{
  hp1: number
  hp2: number
  immortality: boolean
}
export interface keyBool{
  left: boolean
  right: boolean
  jump: boolean
  crouch: boolean
  punch: boolean
  kick: boolean
  block: boolean
}
export interface position{
  x: number
  y: number
}
