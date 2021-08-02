import Utils from './Utils'

class GraphicsManager {
  constructor(id, chessGame) {
    this.element = document.getElementById(id) // The HTML element of the chessboard
    this.chessGame = chessGame
    this.squareEls = []
    this.highlightedSquares = []
    this.drawBoard()
  }

  drawBoard() {
    // Creates the HTML elements to display a plain chessboard
    for (let i = 0; i < 8; i++) {
      const rowArray = []
      this.squareEls.push(rowArray)
      for (let j = 0; j < 8; j++) {
        const squareClassName = ((i + j) % 2) === 0 ? "white" : "black" // Determines whether square should be white or black
        const squareEl = Utils.createElement("div", `square square-${squareClassName}`, this.element) // Append square to the board
        squareEl.setAttribute('data-coords', Utils.getCoords(i, j))
        rowArray.push(squareEl) // Add square to squares to avoid ulterior querySelectors

        squareEl.addEventListener('click', () => this.handleClick(this.getSquareObject(i, j))) // Interaction with square
      }
    }

    this.resizeBoard()
    window.addEventListener('resize', this.resizeBoard.bind(this)) // On window resize, resize board
  }

  resizeBoard() {
    const sideSize = Math.min(window.innerWidth, window.innerHeight) * .8
    this.element.style.width = `${sideSize}px`
    this.element.style.height = `${sideSize}px`
  }

  drawPosition() {
    // Creates the HTML pieces elements to display on the chessboard from a given position
    this.chessGame.matrix.forEach((row, i) => {
      row.forEach((square, j) => {
        const el = this.squareEls[i][j]
        Utils.createElement("div", `piece piece-${square.piece.name} piece-${square.piece.color}`, el) // Append square to the board
      })
    });
  }

  updateSquare(square) {
    const pieceEl = this.getSquareEl(square).querySelector('.piece')
    pieceEl.className = `piece piece-${square.piece.name} piece-${square.piece.color}`
  }

  getSquareEl(square) {
    return this.squareEls[square.rowIndex][square.squareIndex]
  }

  getSquareObject(i, j) {
    return this.chessGame.matrix[i][j]
  }

  handleClick(square) {
    if (!this.firstInput) {
      this.onFirstInput(square)
    } else {
      this.onSecondInput(square)
    }
  }

  onFirstInput(square) {
    if (this.chessGame.turn.color !== square.piece.color) return false // Return early if it's not player's turn

    const legalSquares = this.chessGame.getLegalSquares(square)
    
    legalSquares.forEach(square => {
      const squareEl = this.getSquareEl(square)
      squareEl.classList.add('highlight')

      square.highlight()
      this.highlightedSquares.push(square)
    })

    this.firstInput = square
  }

  onSecondInput(square) {
    if (square.highlighted) {
      this.chessGame.playMove(this.firstInput, square)
    }
    this.highlightedSquares.forEach(square => {
      square.unhighlight()
      this.getSquareEl(square).classList.remove('highlight')
    })
    this.firstInput = false;

  }
}

export default GraphicsManager