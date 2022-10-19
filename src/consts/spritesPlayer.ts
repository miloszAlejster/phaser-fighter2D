const idle1: string = ' o '
const idle2: string = '/|\\'
const idle3: string = '/ \\'
const idle: string = `${idle1}\n${idle2}\n${idle3}`

const crouch1: string = ''
const crouch2: string = '/o\\'
const crouch3: string = '/ \\'
const crouch: string = `${crouch1}\n${crouch2}\n${crouch3}`

const punchRight1: string = ' o_'
const punchRight2: string = '/|'
const punchRight3: string = '/ \\'
const punchRight: string = `${punchRight1}\n${punchRight2}\n${punchRight3}`

const punchLeft1: string = '_o'
const punchLeft2: string = ' |\\'
const punchLeft3: string = '/ \\'
const punchLeft: string = `${punchLeft1}\n${punchLeft2}\n${punchLeft3}`

const punchRightCrouch1: string = ''
const punchRightCrouch2: string = '/o-'
const punchRightCrouch3: string = '/ \\'
const punchRightCrouch: string = `${punchRightCrouch1}\n${punchRightCrouch2}\n${punchRightCrouch3}`

const punchLeftCrouch1: string = ''
const punchLeftCrouch2: string = '-o\\'
const punchLeftCrouch3: string = '/ \\'
const punchLeftCrouch: string = `${punchLeftCrouch1}\n${punchLeftCrouch2}\n${punchLeftCrouch3}`

export {idle, crouch, punchRight, punchLeft, punchRightCrouch, punchLeftCrouch}