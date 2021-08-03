import Utils from './Utils'
import config from './../config'
import GraphicsManager from './GraphicsManager'

class Square {
  constructor(squareIndex, rowIndex, coords, piece, chessGame) {
    this.squareIndex = squareIndex
    this.rowIndex = rowIndex
    this.coords = coords
    this.piece = piece
    this.chessGame = chessGame
    this.highlighted = false
  }

  isWhite() {
    return (this.piece.color === "white")
  }

  isBlack() {
    return (this.piece.color === "black")
  }

  isEmpty() {
    return (this.piece.name === "empty")
  }

  isPawn() {
    return (this.piece.name === "pawn")
  }
  
  isBishop() {
    return (this.piece.name === "bishop")
  }
  
  isKnight() {
    return (this.piece.name === "knight")
  }
  
  isRook() {
    return (this.piece.name === "rook")
  }

  isQueen() {
    return (this.piece.name === "queen")
  }

  isKing() {
    return (this.piece.name === "king")
  }
  
  isAllyOf(square) {
    if ((this.piece.color === "white" && square.piece.color === "white") || (this.piece.color === "black" && square.piece.color === "black")) return true
    return false
  }

  isEnemyOf(square) {
    if ((this.piece.color === "white" && square.piece.color === "black") || (this.piece.color === "black" && square.piece.color === "white")) return true
    return false
  }

  up(x) {
    if (0 <= this.rowIndex - x && this.rowIndex - x <= 7) {
      return this.chessGame.matrix[this.rowIndex - x][this.squareIndex]
    }
    return false
  }

  left(x) {
    if (0 <= this.squareIndex - x && this.squareIndex - x <= 7) {
      return this.chessGame.matrix[this.rowIndex][this.squareIndex - x]
    }
    return false
  }

  right(x) {
    if (0 <= this.squareIndex + x && this.squareIndex + x <= 7) {
      return this.chessGame.matrix[this.rowIndex][this.squareIndex + x]
    }
    return false
  }

  down(x) {
    if (0 <= this.rowIndex + x && this.rowIndex + x <= 7) {
      return this.chessGame.matrix[this.rowIndex + x][this.squareIndex]
    }
    return false
  }

  topRight(x) {
    if (0 <= this.rowIndex - x && this.rowIndex - x <= 7 && 0 <= this.squareIndex + x && this.squareIndex + x <= 7) {
      return this.chessGame.matrix[this.rowIndex - x][this.squareIndex + x]
    }
    return false
  }

  topLeft(x) {
    if (0 <= this.rowIndex - x && this.rowIndex - x <= 7 && 0 <= this.squareIndex - x && this.squareIndex - x <= 7) {
      return this.chessGame.matrix[this.rowIndex - x][this.squareIndex - x]
    }
    return false
  }

  downRight(x) {
    if (0 <= this.rowIndex + x && this.rowIndex + x <= 7 && 0 <= this.squareIndex + x && this.squareIndex + x <= 7) {
      return this.chessGame.matrix[this.rowIndex + x][this.squareIndex + x]
    }
    return false
  }

  downLeft(x) {
    if (0 <= this.rowIndex + x && this.rowIndex + x <= 7 && 0 <= this.squareIndex - x && this.squareIndex - x <= 7) {
      return this.chessGame.matrix[this.rowIndex + x][this.squareIndex - x]
    }
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

  checkPromotion() {
    if (this.isPawn() && this.finalRow()) {
      this.piece.name = "queen"
      this.chessGame.graphicsManager.updateSquare(this)
    }
  }

  highlight() {
    this.highlighted = true
  }

  unhighlight() {
    this.highlighted = false
  }
}

export default Square