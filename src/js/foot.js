import io from 'socket.io-client'
import Animation from './animation'

export default class Foot {
    constructor() {

        this.host = 'http://localhost:8080/'

        this.animation = new Animation()

        this.socket = io( this.host )

        this.init()
    }

    init() {
        this.animation.displayDomElement()

        this.listenSockets()
    }

    listenSockets() {
        this.socket.on('newConnection', (data) => {
            console.log('Connected')

            document.addEventListener( 'click', () => {
              this.socket.emit( 'onNameChange', { name: 'Robin' } );
            })
        })

        this.socket.on('goal', (data) => {
            console.log('goal')
        })
    }
}
