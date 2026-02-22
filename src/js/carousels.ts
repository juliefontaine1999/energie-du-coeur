export class Carousel {
    private track: HTMLElement
    private prevBtn: HTMLButtonElement
    private nextBtn: HTMLButtonElement
    private dots: NodeListOf<HTMLButtonElement>
    private index = 0

    // Touch handling
    private startX = 0
    private startY = 0
    private isSwiping = false
    private readonly swipeThreshold = 50
    private readonly horizontalSwipeThreshold = 20


    constructor(private root: HTMLElement) {
        this.track = root.querySelector('.carousel-track')!
        this.prevBtn = root.querySelector('.carousel-prev')!
        this.nextBtn = root.querySelector('.carousel-next')!
        this.dots = root.querySelectorAll('.carousel-dot')

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
            this.next()
        })

        this.prevBtn.addEventListener('click', () => {
            this.previous()
        })

        window.addEventListener('resize', () => this.update())

        this.track.addEventListener('touchstart', this.onTouchStart, { passive: true })
        this.track.addEventListener('touchend', this.onTouchEnd)

        // Dot navigation
        this.dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                this.goTo(i)
            })
        })
    }

    private update() {
        const card = this.track.children[0] as HTMLElement
        if (!card) return

        const cardWidth = card.offsetWidth
        const styles = getComputedStyle(this.track)
        const gap = parseFloat(styles.columnGap || styles.gap || '0')

        const offset = this.index * (cardWidth + gap)

        this.track.style.transform = `translateX(-${offset}px)`
        this.updateNavigation()
    }

    private next(): void {
        this.index = Math.min(this.index + 1, this.maxIndex)
        this.update()
    }

    private previous(): void {
        this.index = Math.max(this.index - 1, 0)
        this.update()
    }

    private goTo(index: number): void {
        this.index = Math.max(0, Math.min(index, this.maxIndex))
        this.update()
    }

    private updateNavigation(): void {
        // Update arrow visibility
        if (this.index === 0) {
            this.prevBtn.classList.add('hidden')
        } else {
            this.prevBtn.classList.remove('hidden')
        }

        if (this.index >= this.maxIndex) {
            this.nextBtn.classList.add('hidden')
        } else {
            this.nextBtn.classList.remove('hidden')
        }

        // Update dots
        this.dots.forEach((dot, i) => {
            if (i === this.index) {
                dot.classList.add('active')
                dot.setAttribute('aria-selected', 'true')
            } else {
                dot.classList.remove('active')
                dot.setAttribute('aria-selected', 'false')
            }
        })
    }

    public onResize(): void {
        this.index = 0
        this.track.style.transform = 'translateX(0px)'
        this.updateNavigation()
    }

    private onTouchStart = (e: TouchEvent): void => {
        const touch = e.touches[0]
        this.startX = touch.clientX
        this.startY = touch.clientY
        this.isSwiping = true
    }

    private onTouchEnd = (e: TouchEvent): void => {
        if (!this.isSwiping) {
            return
        }
        this.isSwiping = false

        const touch = e.changedTouches[0]
        const deltaX = touch.clientX - this.startX
        const deltaY = touch.clientY - this.startY

        // Ignore if vertical scroll is bigger than horizontal
        if (Math.abs(deltaY) + this.horizontalSwipeThreshold > Math.abs(deltaX)) {
            return
        }

        if (Math.abs(deltaX) < this.swipeThreshold) {
            return
        }

        if (deltaX < 0) {
            this.next()
        } else {
            this.previous()
        }
    }
}
