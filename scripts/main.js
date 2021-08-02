import ChessGame from './Classes/ChessGame.js'
import Player from './Classes/Player.js'

const whitePlayer = new Player("human", "white")
const blackPlayer = new Player("bot", "black")


let startingFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
let otherFEN = "r2q1rk1/pp2n1pp/2nbbp2/3pp3/6PN/P1NP3P/1P2PPB1/R1BQK2R"

const gameConfig = {
  FEN: startingFEN,
  whitePlayer : whitePlayer,
  blackPlayer : blackPlayer,
  boardID: "board"
}

new ChessGame(gameConfig)