import GraphicsManager from './GraphicsManager'
import Square from './Square';
import Utils from './Utils'
import config from '../config';

class ChessGame {
  constructor(gameConfig) {
    this.matrix = this.createMatrix(gameConfig.FEN)
    this.whitePlayer = gameConfig.whitePlayer
    this.blackPlayer = gameConfig.blackPlayer
    this.turn = gameConfig.whitePlayer
    this.graphicsManager = new GraphicsManager(gameConfig.boardID, this)
    this.firstInput = false

    this.startGame()
  }

  createMatrix(FEN) {
    const plainMatrix = Utils.FENtoPlainMatrix(FEN) // Get 8x8 array filled with letters representing pieces FEN notations

    let matrix = []

    plainMatrix.forEach((row, i) => {
      const rowArray = []
      matrix.push(rowArray)
      row.forEach((FENChar, j) => {
        const coords = Utils.getCoords(i, j)
        const piece = Utils.toPiece(FENChar)
        const square = new Square(j, i, coords, piece, this)
        rowArray.push(square)
      })
    })


    return matrix
  }

  startGame() {
    console.log(this.matrix)
    this.graphicsManager.drawPosition() // Draw pieces on board

    if (this.turn.isBot()) {
      this.playBestMove()
    }
  }

  playMove(startSquare, destinationSquare) {

    // Add piece to the new square and remove from old square

    destinationSquare.piece = startSquare.piece
    startSquare.piece = {...config.pieces[0], color: ""}
    // Update board graphics

    this.graphicsManager.updateSquare(destinationSquare)
    this.graphicsManager.updateSquare(startSquare)

    // If move is a pawn reaching 8th row, it becomes a queen
    destinationSquare.checkPromotion()

    this.switchTurn()
    
  }

  switchTurn() {

    // Switch turn
    this.turn = this.turn.isWhite() ? this.blackPlayer : this.whitePlayer

    if (this.gameIsOver()) {
      console.log("Fin de la partie.")
    } else {
      
      if (this.turn.isBot()) {
        this.playBestMove() // TODO: IA
      }

    }
  }

  gameIsOver() {

    if (this.kingInCheck(this.turn)) {
      if (!this.hasLegalSquares(this.turn)) {
        const winner = this.turn.isWhite() ? this.blackPlayer : this.whitePlayer
        console.log(`Checkmate. ${winner.color} wins`)
        return true
      } else {
        console.log(`Check.`)
        return false
      }
    } else if (!this.hasLegalSquares(this.turn)) {
      console.log(`${this.turn.color} no legal moves. Pat.`)
      return true
    }

    if (this.deadPosition()) {
      console.log("Dead position. Draw.")
      return true
    }

    return false
    
  }

  playBestMove() {
    const playerSquares = this.getAllSquares(this.turn)

    const legalMoves = []

    playerSquares.forEach(playerSquare => {
      const legalSquares = this.getLegalSquares(playerSquare)
      legalSquares.forEach(legalSquare => {
        legalMoves.push([playerSquare, legalSquare])
      })
    })

    const rand = legalMoves[Math.floor(Math.random()*legalMoves.length)]

    setTimeout(() => {
      this.playMove(rand[0], rand[1])
    }, 10);
  }

  hasLegalSquares(player) {
    const playerSquares = this.getAllSquares(player)

    let hasLegalSquares = false

    for (let i = 0; i < playerSquares.length; i++) {
      const playerSquare = playerSquares[i];
      const legalSquares = this.getLegalSquares(playerSquare)
      
      if (legalSquares.length !== 0) {
        hasLegalSquares = true
        break;
      }
    }

    return hasLegalSquares
  }

  deadPosition() {
    const whiteSquares = this.getAllSquares(this.whitePlayer) 
    const blackSquares = this.getAllSquares(this.blackPlayer) 
    
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

  getLegalSquares(startSquare) {

    let legalSquares = []
    const semiLegalSquares = this.getSemiLegalSquares(startSquare)

    semiLegalSquares.forEach(destinationSquare => {
      if (this.moveIsLegal(startSquare, destinationSquare)) {
        legalSquares.push(destinationSquare)
      }
    });

    return legalSquares
  }

  moveIsLegal(startSquare, destinationSquare) {
    const destinationPiece = {...destinationSquare.piece}
    const startSquarePiece = {...startSquare.piece}

    // Simulate board if move was played
    destinationSquare.piece = startSquarePiece
    startSquare.piece = {...config.pieces[0], color: ""}

    // If player's king is in check after the move, then it is not legal.
    if (this.kingInCheck(this.turn)) {
      destinationSquare.piece = destinationPiece
      startSquare.piece = startSquarePiece
      return false
    }

    destinationSquare.piece = destinationPiece
    startSquare.piece = startSquarePiece
    
    return true
  }

  getSemiLegalSquares(square) {
    let squares = []

    if (square.isPawn()) {

      // Check if pawn can go ahead
      const aheadSquare = square.isWhite() ? square.up(1) : square.down(1)
      if (aheadSquare && aheadSquare.isEmpty()) {
        // Square ahead of pawn is free
        squares.push(aheadSquare)

        if (square.secondRow()) {
          // Pawn is on its second row and might be able to forward 2 squares
          const ahead2Square = square.isWhite() ? square.up(2) : square.down(2)
          if (ahead2Square && ahead2Square.isEmpty()) {
            // Square 2 ahead of pawn is free
            squares.push(ahead2Square)
          }
        }
      }

      // Check if pawn can eat a piece

      const diagLeftSquare = square.isWhite() ? square.topLeft(1) : square.downLeft(1)
      if (diagLeftSquare && square.isEnemyOf(diagLeftSquare)) {
        squares.push(diagLeftSquare)
      }

      const diagRightSquare = square.isWhite() ? square.topRight(1): square.downRight(1)
      if (diagRightSquare && square.isEnemyOf(diagRightSquare)) {
        squares.push(diagRightSquare)
      }

    }

    if (square.isKnight()) {
      const pieceSquares = this.getKnightSquares(square)
      squares = squares.concat(pieceSquares)
    }

    if (square.isBishop()) {
      const pieceSquares = this.linearSquares(square, 8, square.topRight.bind(square), square.topLeft.bind(square), square.downRight.bind(square), square.downLeft.bind(square))
      squares = squares.concat(pieceSquares)
    }

    if (square.isRook()) {
      const pieceSquares = this.linearSquares(square, 8, square.up.bind(square), square.down.bind(square), square.right.bind(square), square.left.bind(square))
      squares = squares.concat(pieceSquares)
    }

    if (square.isQueen()) {
      const pieceSquares = this.linearSquares(square, 8, square.up.bind(square), square.down.bind(square), square.right.bind(square), square.left.bind(square), square.topRight.bind(square), square.topLeft.bind(square), square.downRight.bind(square), square.downLeft.bind(square))
      squares = squares.concat(pieceSquares)
    }

    if (square.isKing()) {
      const pieceSquares = this.linearSquares(square, 1, square.up.bind(square), square.down.bind(square), square.right.bind(square), square.left.bind(square), square.topRight.bind(square), square.topLeft.bind(square), square.downRight.bind(square), square.downLeft.bind(square))
      squares = squares.concat(pieceSquares)
    }

    return squares

  }

  getKnightSquares(square) {
    let squares = []

    const leftSquare = square.left(2)
    if (leftSquare) {
      const leftTopSquare = leftSquare.up(1)
      if (leftTopSquare && (leftTopSquare.isEmpty() || square.isEnemyOf(leftTopSquare))) {
        squares.push(leftTopSquare)
      }

      const leftDownSquare = leftSquare.down(1)
      if (leftDownSquare && (leftDownSquare.isEmpty() || square.isEnemyOf(leftDownSquare))) {
        squares.push(leftDownSquare)
      }
    }

    const downSquare = square.down(2)
    if (downSquare) {
      const downLeftSquare = downSquare.left(1)
      if (downLeftSquare && (downLeftSquare.isEmpty() || square.isEnemyOf(downLeftSquare))) {
        squares.push(downLeftSquare)
      }
  
      const downRightSquare = downSquare.right(1)
      if (downRightSquare && (downRightSquare.isEmpty() || square.isEnemyOf(downRightSquare))) {
        squares.push(downRightSquare)
      }

    }

    const rightSquare = square.right(2)
    if (rightSquare) {
      const rightDownSquare = rightSquare.down(1)
      if (rightDownSquare && (rightDownSquare.isEmpty() || square.isEnemyOf(rightDownSquare))) {
        squares.push(rightDownSquare)
      }
  
      const rightTopSquare = rightSquare.up(1)
      if (rightTopSquare && (rightTopSquare.isEmpty() || square.isEnemyOf(rightTopSquare))) {
        squares.push(rightTopSquare)
      }
    }

    const topSquare = square.up(2)
    if (topSquare) {
      const topRightSquare = topSquare.right(1)
      if (topRightSquare && (topRightSquare.isEmpty() || square.isEnemyOf(topRightSquare))) {
        squares.push(topRightSquare)
      }

      const topLeftSquare = topSquare.left(1)
      if (topLeftSquare && (topLeftSquare.isEmpty() || square.isEnemyOf(topLeftSquare))) {
        squares.push(topLeftSquare)
      }

    }

    return squares
  }

  linearSquares(square, maxPieceRange, ...directions) {
    const squares = []

    directions.forEach(direction => {
      let index = 1
      let destination = direction(index)

      do {
        if (!destination) break
  
        if (destination.isEmpty()) {
          squares.push(destination)
        }
  
        if (square.isEnemyOf(destination)) {
          squares.push(destination)
          break;
        } else if (square.isAllyOf(destination)) {
          break;
        }
  
        destination = direction(index++)
  
      } while (maxPieceRange >= index)
      
    });

    return squares
  }

  getKingSquare(player) {
    const playerSquares = this.getAllSquares(player)
    const kingSquare = playerSquares.find(playerSquare => playerSquare.piece.name === "king")

    return kingSquare
  }

  getAttackingSquares(attackedSquare) {
    let attackingSquares = []
    
    this.matrix.forEach(row => {
      row.forEach(square => {
        if (!square.isEmpty() && square.isEnemyOf(attackedSquare)) {
          const threats = this.getSemiLegalSquares(square)
          threats.forEach(threat => {
            if (threat.coords === attackedSquare.coords) {
              attackingSquares.push(square);
            }
          })
        }
      })
    })
    return attackingSquares;

  }

  kingInCheck(player) {
    const kingSquare = this.getKingSquare(player)
    return (this.getAttackingSquares(kingSquare).length !== 0)
  }
  

}

export default ChessGame