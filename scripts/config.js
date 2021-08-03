import Player from './Classes/Player'

let pieces = [
  {
    name: "empty",
    notationFEN: " ",
    notation: "",
    score: 0,
  },
  {
    name: "pawn",
    notationFEN: "P",
    notation: "",
    score: 1
  },
  {
    name: "bishop",
    notationFEN: "B",
    notation: "B",
    score: 3
  },
  {
    name: "knight",
    notationFEN: "N",
    notation: "N",
    score: 3
  },
  {
    name: "rook",
    notationFEN: "R",
    notation: "R",
    score: 5
  },
  {
    name: "queen",
    notationFEN: "Q",
    notation: "Q",
    score: 9
  },
  {
    name: "king",
    notationFEN: "K",
    notation: "K",
    score: 100
  }
]

const whitePlayer = new Player("bot", "white")
const blackPlayer = new Player("human", "black")


let startingFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
let otherFEN = "r2q1rk1/pp2n1pp/2nbbp2/3pp3/6PN/P1NP3P/1P2PPB1/R1BQK2R"

const gameConfig = {
  FEN: startingFEN,
  whitePlayer : whitePlayer,
  blackPlayer : blackPlayer,
  boardID: "board"
}

const config = {
  letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  numbers: [8, 7, 6, 5, 4, 3, 2, 1],
  pieces: pieces,
  gameConfig: gameConfig
}

export default config;