import ChessGame from './Classes/ChessGame.js'
import config from './config.js'

const menu = document.querySelector('.menu')
const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  config.gameConfig.blackPlayer.type = form.black.value
  config.gameConfig.whitePlayer.type = form.white.value

  menu.remove()
  new ChessGame(config.gameConfig)
})
