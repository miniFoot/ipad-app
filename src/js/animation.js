import TweenMax from 'gsap'

export default class Animation {
    constructor() {
        // DOM elements
        this.pageTitle = document.getElementById( 'title' )
    }

    displayDomElement() {
        TweenMax.to( this.pageTitle, 0.5,
        { autoAlpha: 1, y: '0%' } )
    }
}
