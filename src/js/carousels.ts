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
            this.index = Math.min(this.index + 1, this.maxIndex)
            this.update()
        })

        this.prevBtn.addEventListener('click', () => {
            this.index = Math.max(this.index - 1, 0)
            this.update()
        })

        window.addEventListener('resize', () => this.update())
    }

    private update() {
        const card = this.track.children[0] as HTMLElement
        if (!card) return

        const cardWidth = card.offsetWidth
        const styles = getComputedStyle(this.track)
        const gap = parseFloat(styles.columnGap || styles.gap || '0')

        const offset = this.index * (cardWidth + gap)

        this.track.style.transform = `translateX(-${offset}px)`
        this.updateArrows();
    }

    private updateArrows(): void {
        const isScrollable = this.cardsVisible < 4;

        if (!isScrollable) {
            this.prevBtn.classList.add('hidden');
            this.nextBtn.classList.add('hidden');
        } else {
            this.prevBtn.classList.remove('hidden');
            this.nextBtn.classList.remove('hidden');

            if (this.index === 0) {
                this.prevBtn.classList.add('hidden');
            } else if (this.index === this.maxIndex) {
                this.nextBtn.classList.add('hidden');
            }
        }
    }
}
