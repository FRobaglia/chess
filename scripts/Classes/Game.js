import Utils from './Utils'
import Square from './Square'
import Player from './Player'
import config from '../config'

function newGame(matrix, white, black) {
  const game = new Game(matrix, white, black)
  game.start()
}

class Game {
  constructor(matrix, white, black) {
    this.boardElement = document.getElementById('board')
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
    console.log("resize")
    const lowest = Math.min(window.innerWidth, window.innerHeight)
    const boardDimension = lowest * .8
    console.log(`${boardDimension}px`)

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
        const squareElement = Utils.createElement('div', `square square-${Utils.getSquareColor(rowIndex, squareIndex)}`, this.boardElement)
        const square = new Square(squareElement, squareIndex, rowIndex, config.piecesID[piece], this)
        rowArray.push(square)

        squareElement.addEventListener('click', () => this.handleClick(square))
      })
    })
  }

  handleClick(square) {
    if (!this.clickedOnce) {
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
    } else {
      // On a second input
      if (square.highlighted) {
        
        // If the selected square is highlighted, play the move
        this.playMove(this.clickedOnce, square)
      }
      
      // Remove square highlights because move has either been played or canceled
      this.highlightedSquares.forEach(square => {
        square.unhighlight()
      })
      this.highlightedSquares = []
      this.clickedOnce = false
    }
  }

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

    const bestMove = this.getBestMove(legalMoves)
    setTimeout(() => {
      this.playMove(bestMove.departure, bestMove.destination)
    }, 10);
  }

  getBestMove(moves) {
    let move = null;
    moves.forEach(move => {
      if (!(move.destination.isEmpty())) {
        move.score = move.destination.piece.score - move.departure.piece.score
      } else {
        move.score = 0
      }
    });

    move = moves.reduce((prev, current) => (prev.score > current.score) ? prev : current)

    if (move.score <= 0) {
      move = moves[Math.floor(Math.random()*moves.length)];
    }
    
    return move
  }

  highlightLegalSquares(square) {
    let legalSquares = square.getLegalSquares()

    if (legalSquares.length !== 0)
    legalSquares.forEach(square => {
      square.highlight()
    })

    return legalSquares
  }

  getKingSquare(player) {
    let kingSquare = null
    let i = 0
    let j = 0

    while (kingSquare === null || (i > 7)) {
      if (i > 7) {
        return kingSquare
      }

      const square = this.matrix[i][j]

      if (square.piece.name === "king" && square.piece.color === player.color) {
        kingSquare = square
      }

      j++
      if (j > 7) {
        i++
        j = 0
      }
    }

    return kingSquare
  }

  isAttacked(attackedSquare) {
    let isAttacked = false
    
    this.matrix.forEach(row => {
      row.forEach(square => {
        if (!square.isEmpty() && square.isEnemyOf(attackedSquare)) {
          const threats = square.getSquares()
          threats.forEach(threat => {
            if (threat.coordinates === attackedSquare.coordinates) {
              isAttacked = true;
            }
          })
        }
      })
    })

    return isAttacked;

  }

  kingInCheck(player) {
    const kingSquare = this.getKingSquare(player)
    return (this.isAttacked(kingSquare))
  }
}

export default Game