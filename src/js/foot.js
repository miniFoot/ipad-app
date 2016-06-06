import io from 'socket.io-client'
import Animation from './animation'

export default class Foot {
    constructor() {

        this.host = 'http://localhost:8080/'

        this.animation = new Animation()

        this.socket = io( this.host )

        this.player = [
          this.one = {
            name : null
          },
          this.two = {
            name : null
          },
          this.three = {
            name : null
          },
          this.four = {
            name : null
          }
        ]

        // this.blueScore = 0
        // this.redScore = 0

        this.start = document.querySelector('#start')
        this.call = document.querySelector('#call')
        this.stop = document.querySelector('#stop')

        this.init()
    }

    init() {
        this.listenSockets()
    }

    stopGame() {

    }

    changeScore(sign, color) {
      this.sign = sign
      this.color = color

      this.scores = document.querySelectorAll('.number')
      this.blueScore = this.scores[0]
      this.redScore = this.scores[1]

      if (this.color == 'blue') {
        if (this.sign == 'minus') {
          if (Number(this.blueScore.innerHTML) != 0) {
            this.blueScore.innerHTML = Number(this.blueScore.innerHTML) - 1
          }
        } else {
          this.blueScore.innerHTML = Number(this.blueScore.innerHTML) + 1
        }
      } else {
        if (this.sign == 'minus') {
          if (Number(this.redScore.innerHTML) != 0) {
              this.redScore.innerHTML = Number(this.redScore.innerHTML) - 1
          }
        } else {
          this.redScore.innerHTML = Number(this.redScore.innerHTML) + 1
        }
      }
    }

    animateItems() {
      document.querySelector('.container').classList.toggle('animated');
      document.querySelector('.game').classList.toggle('show-score');
    }

    getId(){
      this.players = document.querySelectorAll('.player-id')
      for (var i = 0; i < this.players.length; i++) {
        this.player[i].name = this.players[i].value
      }
    }

    listenSockets() {
        this.socket.on('newConnection', (data) => {
            console.log('Connected')

            this.start.addEventListener( 'click', () => {
              this.getId()
              this.socket.emit('onNameChange', this.player)
              this.animateItems()
            })

            this.call.addEventListener( 'click', () => {
              this.socket.emit('onPlayerCall', 'user called')
            })

            this.stop.addEventListener( 'click', () => {
              this.socket.emit('onStopMatch', 'match stoped')
              this.animateItems()
              this.stopGame()
            })

            var self = this
            var actionScore = document.querySelectorAll('.change img')
            for (var i = 0; i < actionScore.length; i++) {
              actionScore[i].addEventListener( 'click', function(){
                if (this.classList.contains('minus') && this.classList.contains('red')) {
                  self.socket.emit('onScoreChanged', 'minus red')
                  self.changeScore('minus', 'red')
                } else if (this.classList.contains('minus') && this.classList.contains('blue')) {
                  self.socket.emit('onScoreChanged', 'minus blue')
                  self.changeScore('minus', 'blue')
                } else if (this.classList.contains('plus') && this.classList.contains('red')) {
                  self.socket.emit('onScoreChanged', 'plus red')
                  self.changeScore('plus', 'red')
                } else {
                  self.socket.emit('onScoreChanged', 'plus blue')
                  self.changeScore('plus', 'blue')
                }
              })
            }
        })
    }
}
