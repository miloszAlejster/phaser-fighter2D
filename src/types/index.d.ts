export interface keysTypes{
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  jump: Phaser.Input.Keyboard.Key
  crouch: Phaser.Input.Keyboard.Key
  punch: Phaser.Input.Keyboard.Key
}
export interface keyBool{
  left: boolean
  right: boolean
  jump: boolean
  crouch: boolean
  punch: boolean
}
export interface position{
  x: number
  y: number
}
declare global {
  interface Window {
    recording: {
        keys: keyBool
    };
    time: number;
  }
}
