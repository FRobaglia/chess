let pieces = {
  empty: {
    name: "empty",
    notation: "",
    score: 0,
  },
  pawn: {
    name: "pawn",
    notation: "",
    score: 1
  },
  bishop: {
    name: "bishop",
    notation: "B",
    score: 3
  },
  knight: {
    name: "knight",
    notation: "N",
    score: 3
  },
  rook: {
    name: "rook",
    notation: "R",
    score: 5
  },
  queen: {
    name: "queen",
    notation: "Q",
    score: 9
  },

  king: {
    name: "king",
    notation: "K",
    score: 20
  }
}

const config = {
  letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  numbers: [8, 7, 6, 5, 4, 3, 2, 1],
  initialBoardMatrix: [
    [10, 9, 8, 11, 12, 8, 9, 10],
    [7, 7, 7, 7, 7, 7, 7, 7],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [4, 3, 2, 5, 6, 2, 3, 4],
  ],
  testMatrix: [
    [0, 0, 0, 11, 12, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 5, 6, 0, 0, 0],
  ],
  piecesID: {
    0: {
      ...pieces.empty,
      color: "no-color",
    },

    1: {
      ...pieces.pawn,
      color: "white"
    },

    2: {
      ...pieces.bishop,
      color: "white"
    },
    3: {
      ...pieces.knight,
      color: "white"
    },
    4: {
      ...pieces.rook,
      color: "white"
    },
    5: {
      ...pieces.queen,
      color: "white"
    },

    6: {
      ...pieces.king,
      color: "white"
    },

    7: {
      ...pieces.pawn,
      color: "black"
    },
    8: {
      ...pieces.bishop,
      color: "black"
    },
    9: {
      ...pieces.knight,
      color: "black"
    },
    10: {
      ...pieces.rook,
      color: "black"
    },
    11: {
      ...pieces.queen,
      color: "black"
    },
    12: {
      ...pieces.king,
      color: "black"
    }
  }
}

export default config;