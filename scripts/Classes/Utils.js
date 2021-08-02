import config from './../config'

class Utils {

  static createElement(tag, className, parent) {
    const element = document.createElement(tag)
    element.className = className
    parent.appendChild(element)
  
    return element
  }

  // Given the index of a row and its square in board matrix, determines the coordinates of the square in chess notation
  // Example : indexToCoords(0, 0) returns "A1" and indexToCoords(7, 7) returns "H8"
  static getCoords(i, j) {
    const coords = `${config.letters[j]}${config.numbers[i]}`
    return coords;
  }

  // Given the coordinates of a square, determines the row and square index in board matrix
  // Example : coordinatesToIndex('A1') returns {rowIndex: 0, squareIndex: 0}
  static getIndex(coords) {
    const indexes = {
      squareIndex: config.letters.indexOf(coords.charAt(0)),
      rowIndex: config.numbers.indexOf(coords.charAt(1))
    }
    return indexes
  }

  // Given a FEN (Forsyth–Edwards Notation, a standard notation for chess), returns a matrix (8x8 2D array) of the position.
  static FENtoPlainMatrix(FEN) {
    const matrix = [
      [], [], [], [], [], [], [], []
    ]
    let currRow = 0
    for (let i = 0; i < FEN.length; i++) {
      const char = FEN.charAt(i);

      if (["p", "n", "b", "r", "q", "k", "P", "N", "B", "R", "Q", "K"].includes(char)) {
        matrix[currRow].push(char)

      } else if (char === "/") {
        currRow++
      } else if (Number.isInteger(parseInt(char))) {
        for (let i = 0; i < parseInt(char); i++) {
          matrix[currRow].push(" ")
        }
      }
    }

    return matrix
  }

  // Given a character that belongs to the FEN notation, returns an object with the information needed
  static toPiece(FENChar) {
    let FENCharisLowerCase = this.isLowerCase(FENChar)
    let piece = config.pieces.find(piece => piece.notationFEN.toLowerCase() === FENChar.toLowerCase())

    // This is not a piece but an empty square
    if (FENChar === " ") {
      piece = {...piece, color: ""}
      return piece
    }

    // This is a piece
    if (FENCharisLowerCase) {
      // Character is lowercase, piece color is black
      piece = {...piece, color: "black"}
    } else {
      // Character is lowercase, piece color is white
      piece = {...piece, color: "white"}
    }

    return piece
  }

  static isLowerCase(str)
    {
      return str == str.toLowerCase() && str != str.toUpperCase();
    }
}

export default Utils