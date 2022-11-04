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

const kickRight1: string = ' o'
const kickRight3: string = '/|_'
const kickRight2: string = '/ '
const kickRight: string = `${kickRight1}\n${kickRight3}\n${kickRight2}`

const kickLef1: string = ' o'
const kickLeft2: string = '_|\\'
const kickLeft3: string = '  \\'
const kickLeft: string = `${kickLef1}\n${kickLeft2}\n${kickLeft3}`

const kickRightCrouch1: string = ''
const kickRightCrouch3: string = '/o\\'
const kickRightCrouch2: string = '/ -'
const kickRightCrouch: string = `${kickRightCrouch1}\n${kickRightCrouch3}\n${kickRightCrouch2}`

const kickLefCrouch1: string = ''
const kickLeftCrouch2: string = '/o\\'
const kickLeftCrouch3: string = '- \\'
const kickLeftCrouch: string = `${kickLefCrouch1}\n${kickLeftCrouch2}\n${kickLeftCrouch3}`

export {idle, crouch, punchRight, punchLeft, punchRightCrouch, punchLeftCrouch, kickRight, kickLeft, kickRightCrouch, kickLeftCrouch}