import io from 'socket.io-client'
import Animation from './animation'

export default class Foot {
    constructor() {

        this.host = 'http://localhost:3000/'

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
        })

        this.socket.on('goal', (data) => {
            console.log('goal')
        })
    }
}
