export interface keysTypes{
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  jump: Phaser.Input.Keyboard.Key
  crouch: Phaser.Input.Keyboard.Key
}
export interface keyBool{
  left: boolean
  right: boolean
  jump: boolean
  crouch: boolean
}
declare global {
  interface Window {
    recording: {
        keys: keyBool
    };
    time: number;
  }
}
