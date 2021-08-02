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

const config = {
  letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  numbers: [8, 7, 6, 5, 4, 3, 2, 1],
  pieces: pieces
}

export default config;