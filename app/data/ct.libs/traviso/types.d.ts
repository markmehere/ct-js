declare namespace ct {
    namespace traviso {
        /**
         * Destroys the sprite specified. If you triumph against an enemy sprite, you'll probably
         * want to destroy it and the asssociated exit.
         *
         * @param   {number}   level      The level upon which you want to kill the sprite
         * @param   {number}   sprite     The sprite you wish to kill
         */
        function kill(level: number, sprite: number): void;

        /**
         * Creates an exit to the specified room in Ct.js - think attack mini-game.
         *
         * @param   {number}    level     The level to create the exit point in
         * @param   {number}    sprite    The sprite to create the exit point at
         * @param   {String}    exitRoom  The Ct.js room to exit to
         */
        function exit(level: number, sprite: number, exitRoom: String): void;

        /**
         * Creates an exit to the specified level in Traviso - think a dungeon cave
         * door progressing one level down.
         *
         * @param   {String}    level     The to create the exit point in
         * @param   {number}    sprite    The sprite to create the exit point at
         * @param   {number}    exitLevel The level to exit to (if not specified assumes current
         *                                level plus one)
         */
         function exitToLevel(level: number, sprite: number, exitLevel?: number): void;

        /**
         * Switches to the Traviso level specified. Make sure you specify the exits beforehand.
         *
         * @param   {number}  level  The Traviso level
         */
        function start(level: number): void;
    }
}
