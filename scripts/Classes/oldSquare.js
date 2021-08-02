import Utils from './Utils'
import config from '../config'

class Square {
  constructor(squareIndex, rowIndex, coords, piece) {
    this.element = element
    this.squareIndex = squareIndex
    this.rowIndex = rowIndex
    this.coordinates = coordinates
    this.piece = piece
    this.pieceElement = null
    this.highlighted = false
    this.game = game

    this.updatePos = this.updatePos.bind(this)
    this.resetPos = this.resetPos.bind(this)

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

  updatePos(e) {
    if (this.pieceElement.style.position !== "fixed") this.pieceElement.style.position = "fixed"
    const size = this.game.boardDimension * 0.125
    this.pieceElement.style.left = `${e.clientX - size*.5}px`
    this.pieceElement.style.top = `${e.clientY - size*.5}px`
  }

  resetPos(e) {
    document.removeEventListener('mousemove', this.updatePos)

    
    console.log(e)
    let landingSquare = null
    
    e.path.forEach(el => {
      if (el && el.classList) {
        if (el.classList.contains("square")) {
          landingSquare = el
        }
      }
    })
    
    if (landingSquare !== null) {
      landingSquare = this.game.getSquareFromEl(landingSquare)
      if (landingSquare.highlighted) {
        this.game.secondInput(landingSquare)
      }
    }

    this.pieceElement.style.zIndex = "1"
    this.pieceElement.style.position = "absolute"
    this.pieceElement.style.width = ""
    this.pieceElement.style.height =  ""
    this.pieceElement.style.left =  0
    this.pieceElement.style.top = 0
    
    this.game.stopShowingMoves()
  }
}

export default Square