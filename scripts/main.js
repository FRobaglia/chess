import Game from './Classes/Game.js'
import config from './config.js'
import Player from './Classes/Player.js'

const game = new Game(config.initialBoardMatrix, new Player("bot", "white"), new Player("bot", "black"))
game.start()