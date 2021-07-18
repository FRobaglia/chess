class Player {
  constructor(type, color) {
    this.type = type
    this.color = color
  }

  isWhite() {
    return this.color === "white"
  }

  isBlack() {
    return this.color === "black"
  }

  isBot() {
    return this.type === "bot"
  }
}

export default Player