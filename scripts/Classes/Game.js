import Utils from './Utils'
import Square from './oldSquare'
import Player from './Player'
import config from '../config'

function newGame(matrix, white, black) {
  const game = new Game(matrix, white, black)
  game.start()
}

class Game {
  constructor(matrix, white, black) {
    this.boardElement = document.getElementById('board')
    this.boardDimension = 0
    this.white = white
    this.black = black
    this.numberMatrix = matrix
    this.matrix = []
    this.clickedOnce = false
    this.turn = white
    this.highlightedSquares = []
  }

  start() {
      console.log("Game has started.")
      this.resizeBoard()

      window.addEventListener('resize', () => this.resizeBoard())

      this.drawBoard()
  
      if (this.turn.isBot()) {
        this.playBestMove()
      }
  }

  resizeBoard() {
    const lowest = Math.min(window.innerWidth, window.innerHeight)
    const boardDimension = lowest * .8
    this.boardDimension = boardDimension

    this.boardElement.style.width = `${boardDimension}px`
    this.boardElement.style.height = `${boardDimension}px`
  }

  end() {
    console.log("Game has ended.")
    
    setTimeout(() => {
      newGame(config.initialBoardMatrix, this.white, this.black)
    }, 2000);
  }

  drawBoard() {
    this.boardElement.querySelectorAll('.square').forEach(el => el.remove())
    this.numberMatrix.forEach((row, rowIndex) => {
      const rowArray = []
      this.matrix.push(rowArray)
      row.forEach((piece, squareIndex) => {
        const coords = Utils.indexToCoordinates(squareIndex, rowIndex)
        const squareElement = Utils.createElement('div', `square square-${Utils.getSquareColor(rowIndex, squareIndex)}`, this.boardElement)
        squareElement.setAttribute("data-coords", coords)
        const square = new Square(squareElement, squareIndex, rowIndex, coords, config.piecesID[piece], this)
        rowArray.push(square)
        squareElement.addEventListener('click', () => this.handleClick(square))
      })
    })
  }

  getSquareFromEl(el) {
    let squareFromEl = null
    const coords = el.getAttribute("data-coords")

    this.matrix.forEach(row => {
      row.forEach(square => {
        if (coords === square.coordinates) squareFromEl = square
      })
    })

    return squareFromEl
  }

  handleClick(square) {
    if (!this.clickedOnce) {
      // On first input, show moves
      this.firstInput(square)
    } else {
      this.secondInput(square)
    }
  }

  secondInput(square) {
      // On a second input
      if (square.highlighted) {
        // If the selected square is highlighted, play the move
        this.playMove(this.clickedOnce, square)
      }

      // Anyways, stop showing moves for square
      this.stopShowingMoves()
  }

  firstInput(square) {
    console.log(`${square.coordinates} | ${square.piece.color} ${square.piece.name}`)
    if (this.turn.color !== square.piece.color) return // Don't show movepool if it's not player's turn
    if (!square.isEmpty()) {

      // Highlight legal moves(if any), and wait for new input
      this.highlightedSquares = this.highlightLegalSquares(square)
      if (this.highlightedSquares.length !== 0) {
        this.clickedOnce = square
      } else {
        console.log(`${square.coordinates} has no legal moves.`)
      }
    }
  }

  stopShowingMoves() {
    // Remove highlights because current showed move has either been played or canceled
    this.highlightedSquares.forEach(square => {
      square.unhighlight()
    })
    this.highlightedSquares = []
    this.clickedOnce = false
    
  }

  // drag(square) {
  //   this.firstInput(square)
  //   const el = square.pieceElement
  //   const size = this.boardDimension * 0.125

  //   el.style.zIndex = "15"
  //   el.style.position = "absolute"
  //   el.style.width = `${size}px`
  //   el.style.height = `${size}px`

  //   document.addEventListener('mousemove', square.updatePos)
  //   document.addEventListener('mouseup', square.resetPos)
  // }

  playMove(departure, destination) {
    console.log(`${this.getMoveNotation(departure, destination)} has been played.`)

    // Add piece to the new square
    destination.piece = departure.piece
    destination.update()

    // Remove piece from its old square
    departure.piece = config.piecesID[0]
    departure.update()

    // If move is a pawn reaching 8th row, it becomes a queen
    destination.queenCheck()

    console.log("Position score : " + this.evaluatePosition(this.turn))

    this.switchTurn()
  }

  switchTurn() {

    // Switch turn
    this.turn = this.turn.isWhite() ? this.black : this.white

    if (this.gameIsOver()) {
      this.end()
    } else if (this.turn.isBot()) {
      this.playBestMove()
    }
  }

  gameIsOver() {

    if (this.kingInCheck(this.turn)) {
      if (this.noLegalSquares(this.turn)) {
        const winner = this.turn.isWhite() ? this.black : this.white
        console.log(`Checkmate. ${winner.color} wins`)
        return true
      } else {
        console.log(`Check.`)
        return false
      }
    } else if (this.noLegalSquares(this.turn)) {
      console.log(`${this.turn.color} no legal moves. Pat.`)
      return true
    }

    if (this.deadPosition()) {
      console.log("Dead position. Draw.")
      return true
    }

    return false
    
  }

  deadPosition() {
    const whiteSquares = this.getAllSquares(this.white) 
    const blackSquares = this.getAllSquares(this.black) 
    
    if (this.insufficientMaterial(whiteSquares) && this.insufficientMaterial(blackSquares)) {
      return true
    }

    return false
  }

  insufficientMaterial(squares) {

    let insufficientMaterial = true

    if (squares.length > 2) {
      insufficientMaterial = false
    }

    squares.forEach(square => {
      if (["queen", "rook", "pawn"].includes(square.piece.name)) {
        insufficientMaterial = false
      }
    })

    return insufficientMaterial
  }

  getAllSquares(player) {
    // Get all squares containing a piece of the player's color
    const squares = []
    this.matrix.forEach(row => {
      row.forEach(square => {
        if (square.piece.color === player.color) {
          squares.push(square)
        }
      })
    })

    return squares
  }

  getMoveNotation(departure, destination) {
    let notation = "";

    if (!destination.isEmpty()) {
      // Move is a capture
      if (departure.isPawn()) {
        // Move is a pawn move, add only its letter to notation
        notation += departure.coordinates.charAt(0)
      } else {
        // Move is not a pawn move, add piece notation to notation
        notation += departure.piece.notation
      }
      notation += "x" // Add the x to show the move is a capture
    } else if (!departure.isPawn()) {
      notation += departure.piece.notation // Move is not a capture and square is not a pawn, add piece notation to notation
    }
    notation += destination.coordinates // Finally, always add the destination square coordinates to notation

    return notation
  }

  noLegalSquares(player) {
    let noLegalSquares = true;

    let i = 0
    let j = 0

    while (noLegalSquares || (i > 7)) {
      if (i > 7) {
        return noLegalSquares
      }

      const square = this.matrix[i][j]

      if (player.color === square.piece.color) {
        const legalSquares = square.getLegalSquares()
          if (legalSquares.length !== 0) {
            noLegalSquares = false
          }
      }

      j++
      if (j > 7) {
        i++
        j = 0
      }
    }
    
    return noLegalSquares
  }

  playBestMove() {
    const legalMoves = []
    
    this.matrix.forEach(row => {
      row.forEach(square => {
        if (!square.isEmpty() && square.piece.color === this.turn.color)
        square.getLegalSquares().forEach(move => {
          legalMoves.push({departure: square, destination: move})
        })
      })
    })

    const bestMove = this.getBestMove(legalMoves, 1)
    setTimeout(() => {
      this.playMove(bestMove.departure, bestMove.destination)
    }, 10);
  }

  getBestMove(moves, depth) {
    let move = null;

    for (let i = 0; i < depth; i++) {
      moves.forEach(move => {
        move.score = this.getMoveValue(move.departure, move.destination)
      });
    }

    move = moves.reduce((prev, current) => (prev.score > current.score) ? prev : current)

    if (move.score === 0) {
      move = moves[Math.floor(Math.random()*moves.length)];
    }
    
    return move
  }

  getMoveValue(departure, destination) {
    // Play a move and return its score

    const score = this.evaluatePosition(this.turn)

    // Remember
    const destinationPiece = destination.piece
    const departurePiece = departure.piece

    // Play
    destination.piece = departurePiece
    departure.piece = config.piecesID[0]

    const newScore = this.evaluatePosition(this.turn)
    
    // Reset
    destination.piece = destinationPiece
    departure.piece = departurePiece

    return newScore - score
  }

  evaluatePosition(turn) {
    const whitePieces = this.getAllSquares(this.white)
    const blackPieces = this.getAllSquares(this.black)

    let whiteScore = 0
    let blackScore = 0

    whitePieces.forEach(square => {
      const attackingSquares = this.getAttackingSquares(square)
        if (turn.isWhite()) {
          // Check for attacks
          whiteScore += square.piece.score
        } else {
          // Check for attacked
          if (attackingSquares.length >= 1) {
            // Square is attacked and it's not my turn !
            attackingSquares.forEach(attackingSquare => {
              if (attackingSquare.piece.score > square.piece.score) {
                // Piece attacking is stronger than our piece, so ignore danger
                whiteScore += square.piece.score
              } else {
                // Piece attacking is weaker, so our score isn't piece.score but attackedPieceScore - piece.score
                whiteScore += attackingSquare.piece.score - square.piece.score
              }
            })
          }
        }
    })

    blackPieces.forEach(square => {
      const attackingSquares = this.getAttackingSquares(square)
        if (turn.isBlack()) {
          // Check for attacks
          blackScore += square.piece.score
        } else {
          // Check for attacked
          if (attackingSquares.length >= 1) {
            // Square is attacked and it's not my turn !
            attackingSquares.forEach(attackingSquare => {
              if (attackingSquare.piece.score > square.piece.score) {
                // Piece attacking is stronger than our piece, so ignore danger
                blackScore += square.piece.score
              } else {
                // Piece attacking is weaker, so our score isn't piece.score but attackedPieceScore - piece.score
                blackScore += attackingSquare.piece.score - square.piece.score
              }
            })
          }
        }
    })

    const score = x;
    return score
  }
  

  highlightLegalSquares(square) {
    let legalSquares = square.getLegalSquares()

    if (legalSquares.length !== 0)
    legalSquares.forEach(square => {
      square.highlight()
    })

    return legalSquares
  }
}

export default Game