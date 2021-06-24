## `ct.traviso.kill(level: number, sprite: number)`

Destroys the sprite specified. If you triumph against an enemy sprite, you'll probably
want to destroy it and the asssociated exit.

## `ct.traviso.exit(level: number, sprite: number, exitRoom: String)`

Creates an exit to the specified room in Ct.js - think attack mini-game.

## `ct.traviso.exitToLevel(level: number, sprite: number, exitLevel?: String)`

Creates an exit to the specified level in Ct.js - think a dungeon cave door
progressing one level down. If exitLevel is not specified assumes current
level plus one.

## `ct.traviso.start(level: number)`

Switches to the Traviso level specified. Make sure you specify the exits beforehand.
