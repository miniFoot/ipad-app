import io from 'socket.io-client'
import Animation from './animation'

var run = true

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

      run = false

      this.animateItems()

      this.players = document.querySelectorAll('.player-id')
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].value = ""
      }
    }

    countdown(minutes) {
        var seconds = 60;
        var mins = minutes
        var self = this
        function tick() {
            var counter = document.getElementById("timer");
            var current_minutes = mins-1
            seconds--;
            counter.innerHTML =
            current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
            if( seconds > 0 ) {
                if (!run) {
                  test = clearTimeout(test)
                  counter.innerHTML = ""
                  run = true
                } else {
                  var test = setTimeout(tick, 1000)
                }
            } else {
                if(mins > 1){
                  var test2 = setTimeout(function () { self.countdown(mins - 1); }, 1000)
                }
            }
        }
        tick()
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
      this.players = document.querySelectorAll('.player-id')
      for (var i = 0; i < this.players.length; i++) {
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
    }

    closePopin(){
      document.querySelector('.cross').addEventListener('click', () => {
        console.log('ok');
        this.popin.classList.toggle('show')
      })
    }

    listenSockets() {

        this.socket.on('addGoal', function(color, msg){
          this.showGoal(color, msg)
          this.changeScore('plus', color)
        }.bind(this))

        this.socket.on('onStopMatch', function(color){
          this.stopGame()
        }.bind(this))

        this.socket.on('newConnection', (data) => {

            this.start.addEventListener( 'click', () => {
              this.getId()
              this.socket.emit('onNameChange', this.player)
              this.animateItems()

              this.countdown(20)

              // stop game after 20 minutes
              setTimeout(function () {
                this.stopGame()
              }.bind(this), 200000);

            })

            this.call.addEventListener( 'click', () => {
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
