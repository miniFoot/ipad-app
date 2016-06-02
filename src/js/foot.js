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

        this.start = document.querySelector('#start')
        this.call = document.querySelector('#call')

        this.init()
    }

    init() {
        this.animation.displayDomElement()

        this.listenSockets()
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
              document.querySelector('.container').classList.add('animated');
              document.querySelector('.game').classList.add('show-score');
            })

            this.call.addEventListener( 'click', () => {
              this.socket.emit('onPlayerCall', 'user called')
            })
        })
    }
}
