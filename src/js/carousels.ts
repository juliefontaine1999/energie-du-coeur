export class Carousel {
    private track: HTMLElement
    private prevBtn: HTMLButtonElement
    private nextBtn: HTMLButtonElement
    private index = 0

    constructor(private root: HTMLElement) {
        this.track = root.querySelector('.carousel-track')!
        this.prevBtn = root.querySelector('.prev-button')!
        this.nextBtn = root.querySelector('.next-button')!

        this.bindEvents()
        this.update()
    }

    private get cardsVisible(): number {
        const value = getComputedStyle(this.root)
            .getPropertyValue('--cards-visible')
        return Number(value) || 1
    }

    private get maxIndex(): number {
        return Math.max(
            0,
            this.track.children.length - this.cardsVisible
        )
    }

    private bindEvents() {
        this.nextBtn.addEventListener('click', () => {
            console.log('click next');
            this.index = Math.min(this.index + 1, this.maxIndex)
            this.update()
        })

        this.prevBtn.addEventListener('click', () => {
            console.log('click previous');
            this.index = Math.max(this.index - 1, 0)
            this.update()
        })

        window.addEventListener('resize', () => this.update())
    }

    private update() {
        const offset = this.index * (100 / this.cardsVisible)
        this.track.style.transform = `translateX(-${offset}%)`
    }
}
