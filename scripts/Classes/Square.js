import Utils from './Utils'
import config from './../config'

class Square {
  constructor(element, squareIndex, rowIndex, piece, game) {
    this.element = element
    this.squareIndex = squareIndex
    this.rowIndex = rowIndex
    this.coordinates = Utils.indexToCoordinates(squareIndex, rowIndex)
    this.piece = piece
    this.pieceElement = null
    this.highlighted = false
    this.game = game

    this.update()
  }

  update() {
    if (this.pieceElement) this.pieceElement.remove()
    const pieceElement = Utils.createElement('div', `piece piece-${this.piece.name} piece-${this.piece.color}`, this.element)
    this.pieceElement = pieceElement
  }

  highlight() {
    this.element.classList.add('highlight')
    this.highlighted = true
  }

  unhighlight() {
    this.element.classList.remove('highlight')
    this.highlighted = false
  }

  moveIsLegal(destination) {
    // Simulate board if move was played
    const destinationPiece = destination.piece
    const thisPiece = this.piece

    destination.piece = this.piece
    this.piece = config.piecesID[0]

    // If player's king is in check after the move, then it is not legal.
    if (this.game.kingInCheck(this.game.turn)) {
      destination.piece = destinationPiece
      this.piece = thisPiece
      return false
    }

    destination.piece = destinationPiece
    this.piece = thisPiece
    return true
  }

  getLegalSquares() {
    let legalSquares = []
    let squares = this.getSquares()

    squares.forEach(square => {
      if (this.moveIsLegal(square)) {
        legalSquares.push(square)
      }
    });

    return legalSquares
  }

  getSquares() {
    let squares = []

    if (this.isPawn()) {

      // Check if pawn can go ahead
      const aheadSquare = this.isWhite() ? this.squareUp(1) : this.squareDown(1)
      if (aheadSquare && aheadSquare.isEmpty()) {
        // Square ahead of pawn is free
        squares.push(aheadSquare)

        if (this.secondRow()) {
          // Pawn is on its second row and might be able to forward 2 squares
          const ahead2Square = this.isWhite() ? this.squareUp(2) : this.squareDown(2)
          if (ahead2Square && ahead2Square.isEmpty()) {
            // Square 2 ahead of pawn is free
            squares.push(ahead2Square)
          }
        }
      }

      // Check if pawn can eat a piece

      const diagLeftSquare = this.isWhite() ? this.squareTopLeft(1) : this.squareDownLeft(1)
      if (diagLeftSquare && this.isEnemyOf(diagLeftSquare)) {
        squares.push(diagLeftSquare)
      }

      const diagRightSquare = this.isWhite() ? this.squareTopRight(1): this.squareDownRight(1)
      if (diagRightSquare && this.isEnemyOf(diagRightSquare)) {
        squares.push(diagRightSquare)
      }

    }

    if (this.isKnight()) {
      const pieceSquares = this.getKnightSquares()
      squares = squares.concat(pieceSquares)
    }

    if (this.isBishop()) {
      const pieceSquares = this.getLinearPieceSquares(8, this.squareTopRight.bind(this), this.squareTopLeft.bind(this), this.squareDownRight.bind(this), this.squareDownLeft.bind(this))
      squares = squares.concat(pieceSquares)
    }

    if (this.isRook()) {
      const pieceSquares = this.getLinearPieceSquares(8, this.squareUp.bind(this), this.squareDown.bind(this), this.squareRight.bind(this), this.squareLeft.bind(this))
      squares = squares.concat(pieceSquares)
    }

    if (this.isQueen()) {
      const pieceSquares = this.getLinearPieceSquares(8, this.squareUp.bind(this), this.squareDown.bind(this), this.squareRight.bind(this), this.squareLeft.bind(this), this.squareTopRight.bind(this), this.squareTopLeft.bind(this), this.squareDownRight.bind(this), this.squareDownLeft.bind(this))
      squares = squares.concat(pieceSquares)
    }

    if (this.isKing()) {
      const pieceSquares = this.getLinearPieceSquares(1, this.squareUp.bind(this), this.squareDown.bind(this), this.squareRight.bind(this), this.squareLeft.bind(this), this.squareTopRight.bind(this), this.squareTopLeft.bind(this), this.squareDownRight.bind(this), this.squareDownLeft.bind(this))
      squares = squares.concat(pieceSquares)
    }

    return squares
  }

  getLinearPieceSquares(maxPieceRange, ...directions) {
    const squares = []

    directions.forEach(direction => {
      let index = 1
      let destination = direction(index)

      do {
        if (!destination) break
  
        if (destination.isEmpty()) {
          squares.push(destination)
        }
  
        if (this.isEnemyOf(destination)) {
          squares.push(destination)
          break;
        } else if (this.isAllyOf(destination)) {
          break;
        }
  
        destination = direction(index++)
  
      } while (maxPieceRange >= index)
      
    });

    return squares
  }

  getKnightSquares() {
    let squares = []

    const leftSquare = this.squareLeft(2)
    if (leftSquare) {
      const leftTopSquare = leftSquare.squareUp(1)
      if (leftTopSquare && (leftTopSquare.isEmpty() || this.isEnemyOf(leftTopSquare))) {
        squares.push(leftTopSquare)
      }

      const leftDownSquare = leftSquare.squareDown(1)
      if (leftDownSquare && (leftDownSquare.isEmpty() || this.isEnemyOf(leftDownSquare))) {
        squares.push(leftDownSquare)
      }
    }

    const downSquare = this.squareDown(2)
    if (downSquare) {
      const downLeftSquare = downSquare.squareLeft(1)
      if (downLeftSquare && (downLeftSquare.isEmpty() || this.isEnemyOf(downLeftSquare))) {
        squares.push(downLeftSquare)
      }
  
      const downRightSquare = downSquare.squareRight(1)
      if (downRightSquare && (downRightSquare.isEmpty() || this.isEnemyOf(downRightSquare))) {
        squares.push(downRightSquare)
      }

    }

    const rightSquare = this.squareRight(2)
    if (rightSquare) {
      const rightDownSquare = rightSquare.squareDown(1)
      if (rightDownSquare && (rightDownSquare.isEmpty() || this.isEnemyOf(rightDownSquare))) {
        squares.push(rightDownSquare)
      }
  
      const rightTopSquare = rightSquare.squareUp(1)
      if (rightTopSquare && (rightTopSquare.isEmpty() || this.isEnemyOf(rightTopSquare))) {
        squares.push(rightTopSquare)
      }
    }

    const topSquare = this.squareUp(2)
    if (topSquare) {
      const topRightSquare = topSquare.squareRight(1)
      if (topRightSquare && (topRightSquare.isEmpty() || this.isEnemyOf(topRightSquare))) {
        squares.push(topRightSquare)
      }

      const topLeftSquare = topSquare.squareLeft(1)
      if (topLeftSquare && (topLeftSquare.isEmpty() || this.isEnemyOf(topLeftSquare))) {
        squares.push(topLeftSquare)
      }

    }

    return squares
  }
  
  isAllyOf(square) {
    if ((this.piece.color === "white" && square.piece.color === "white") || (this.piece.color === "black" && square.piece.color === "black")) return true
    return false
  }

  isEnemyOf(square) {
    if ((this.piece.color === "white" && square.piece.color === "black") || (this.piece.color === "black" && square.piece.color === "white")) return true
    return false
  }

  secondRow() {
    if (this.isWhite()) {
      return this.rowIndex === 6
    } else if (this.isBlack()) {
      return this.rowIndex === 1
    }
  }

  finalRow() {
    if (this.isWhite()) {
      return this.rowIndex === 0
    } else if (this.isBlack()) {
      return this.rowIndex === 7
    }

  }

  queenCheck() {
    if (this.isPawn() && this.finalRow()) {
      this.piece = this.isWhite() ? config.piecesID[5] : config.piecesID[11]
      this.update()
    }
  }

  isWhite() {
    if (this.piece.color === "white") return true
    return false
  }

  isBlack() {
    if (this.piece.color === "black") return true
    return false
  }

  isEmpty() {
    if (this.piece.name === "empty") return true
    return false
  }

  isPawn() {
    if (this.piece.name === "pawn") return true
    return false
  }
  
  isBishop() {
    if (this.piece.name === "bishop") return true
    return false
  }
  
  isKnight() {
    if (this.piece.name === "knight") return true
    return false
  }
  
  isRook() {
    if (this.piece.name === "rook") return true
    return false
  }

  isQueen() {
    if (this.piece.name === "queen") return true
    return false
  }

  isKing() {
    if (this.piece.name === "king") return true
    return false
  }

  squareUp(x) {
    if (0 <= this.rowIndex - x && this.rowIndex - x <= 7) {
      return this.game.matrix[this.rowIndex - x][this.squareIndex]
    }
    return false
  }

  squareLeft(x) {
    if (0 <= this.squareIndex - x && this.squareIndex - x <= 7) {
      return this.game.matrix[this.rowIndex][this.squareIndex - x]
    }
    return false
  }

  squareRight(x) {
    if (0 <= this.squareIndex + x && this.squareIndex + x <= 7) {
      return this.game.matrix[this.rowIndex][this.squareIndex + x]
    }
    return false
  }

  squareDown(x) {
    if (0 <= this.rowIndex + x && this.rowIndex + x <= 7) {
      return this.game.matrix[this.rowIndex + x][this.squareIndex]
    }
    return false
  }

  squareTopRight(x) {
    if (0 <= this.rowIndex - x && this.rowIndex - x <= 7 && 0 <= this.squareIndex + x && this.squareIndex + x <= 7) {
      return this.game.matrix[this.rowIndex - x][this.squareIndex + x]
    }
    return false
  }

  squareTopLeft(x) {
    if (0 <= this.rowIndex - x && this.rowIndex - x <= 7 && 0 <= this.squareIndex - x && this.squareIndex - x <= 7) {
      return this.game.matrix[this.rowIndex - x][this.squareIndex - x]
    }
    return false
  }

  squareDownRight(x) {
    if (0 <= this.rowIndex + x && this.rowIndex + x <= 7 && 0 <= this.squareIndex + x && this.squareIndex + x <= 7) {
      return this.game.matrix[this.rowIndex + x][this.squareIndex + x]
    }
    return false
  }

  squareDownLeft(x) {
    if (0 <= this.rowIndex + x && this.rowIndex + x <= 7 && 0 <= this.squareIndex - x && this.squareIndex - x <= 7) {
      return this.game.matrix[this.rowIndex + x][this.squareIndex - x]
    }
    return false
    
  }
}

export default Square