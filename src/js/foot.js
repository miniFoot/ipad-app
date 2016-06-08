import io from 'socket.io-client'
import Animation from './animation'

export default class Foot {
    constructor() {

        this.host = 'http://5.196.7.169:8080/'

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
        this.players = document.querySelectorAll('.player-id')
        this.started = document.querySelector('#start')
        this.call = document.querySelector('#call')
        this.stop = document.querySelector('#stop')
        this.popin = document.querySelector('.popin')
        this.scores = document.querySelectorAll('.number')
        this.blueScore = this.scores[0]
        this.redScore = this.scores[1]

        this.init()
    }

    init() {
        this.listenSockets()
        this.closePopin()
    }

    stopGame() {
      this.blueScore.innerHTML = 0
      this.redScore.innerHTML = 0

      this.animateItems()

      this.players = document.querySelectorAll('.player-id')
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].value = ""
        this.players[i].parentElement.style.display = 'block'
      }
    }

    changeScore(sign, color) {
      this.sign = sign
      this.color = color

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

      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].value == "") {
          this.players[i].parentElement.style.display = 'none'
        }
        this.player[i].name = this.players[i].value
      }
    }

    showGoal(color, msg){
      this.color = color
      this.popin.classList.remove('blue')
      this.popin.classList.remove('red')
      this.popin.classList.add(this.color)
      this.popin.classList.toggle('show')

      this.popin.querySelector('.punchline').innerHTML = msg

      setTimeout(function () {
        this.popin.classList.toggle('show')
      }.bind(this), 8000);
    }

    closePopin(){
      document.querySelector('.cross').addEventListener('click', () => {
        console.log('ok');
        this.popin.classList.toggle('show')
      })
    }

    listenSockets() {

        this.socket.on('addGoal', function(color, msg){
          console.log("changedscore");
          this.showGoal(color, msg)
          this.changeScore('plus', color)
        }.bind(this))

        this.socket.on('onStopMatch', function(color){
          this.stopGame()
        }.bind(this))

        this.socket.on('newConnection', (data) => {

            this.started.addEventListener( 'click', () => {
              if ((this.players[0].value != "") && (this.players[2].value != "")) {
                this.getId()
                this.socket.emit('onNameChange', this.player)
                this.socket.emit('onStartMatch', 'started');
                this.animateItems()
              }

              // stop game after 20 minutes
              // setTimeout(function () {
              //   this.stopGame()
              // }.bind(this), 200000);

            })

            this.call.addEventListener( 'click', () => {
              this.getId()
              this.socket.emit('onNameChange', this.player)
              this.socket.emit('onPlayerCall', 'user called')
            })

            this.stop.addEventListener( 'click', () => {
              this.stopGame()
              this.socket.emit('onStopMatch', 'match stoped')
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
