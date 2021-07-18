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
  static indexToCoordinates(squareIndex, rowIndex) {
    const coords = `${config.letters[squareIndex]}${config.numbers[rowIndex]}`
    return coords;
  }

  // Given the coordinates of a square, determines the row and square index in board matrix
  // Example : coordinatesToIndex('A1') returns {rowIndex: 0, squareIndex: 0}
  static coordinatesToIndex(string) {
    const indexes = {
      squareIndex: config.letters.indexOf(string.charAt(0)),
      rowIndex: config.numbers.indexOf(string.charAt(1))
    }
    return indexes
  }

  // Determines whether the square should be light or dark, for first board draw
  static getSquareColor(rowIndex, squareIndex) {
    if (rowIndex % 2 === 0) {
      if (squareIndex % 2 === 0) {
        return 'light'
      } else {
        return 'dark'
      }
    } else {
      if (squareIndex % 2 === 0) {
        return 'dark'
      } else {
        return 'light'
      }
    }
  }
}

export default Utils