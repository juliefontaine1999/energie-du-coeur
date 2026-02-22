export class Carousel {
    private track: HTMLElement
    private prevBtn: HTMLButtonElement
    private nextBtn: HTMLButtonElement
    private nav: HTMLElement
    private dotsContainer: HTMLElement
    private dots: HTMLButtonElement[] = []
    private index = 0
    private previousCardsVisible = 1

    // Touch handling
    private startX = 0
    private startY = 0
    private isSwiping = false
    private readonly swipeThreshold = 50
    private readonly horizontalSwipeThreshold = 30


    constructor(private root: HTMLElement) {
        this.track = root.querySelector('.carousel-track')!
        this.prevBtn = root.querySelector('.carousel-prev')!
        this.nextBtn = root.querySelector('.carousel-next')!
        this.nav = root.querySelector('.carousel-nav')!
        this.dotsContainer = root.querySelector('.carousel-dots')!

        this.previousCardsVisible = this.cardsVisible
        this.bindEvents()
        this.createDots()
        this.update()
    }

    private get cardsVisible(): number {
        const value = getComputedStyle(this.root)
            .getPropertyValue('--cards-visible')
        return Number(value) || 1
    }

    private get totalCards(): number {
        return this.track.children.length
    }

    private get maxIndex(): number {
        return Math.max(0, this.totalCards - this.cardsVisible)
    }

    private get allCardsVisible(): boolean {
        return this.cardsVisible >= this.totalCards
    }

    private bindEvents() {
        this.nextBtn.addEventListener('click', () => {
            this.next()
        })

        this.prevBtn.addEventListener('click', () => {
            this.previous()
        })

        window.addEventListener('resize', () => {
            this.handleResize()
        })

        this.track.addEventListener('touchstart', this.onTouchStart, { passive: true })
        this.track.addEventListener('touchend', this.onTouchEnd)
    }

    private handleResize(): void {
        const currentCardsVisible = this.cardsVisible

        // Only reset if breakpoint actually changed (cardsVisible changed)
        if (currentCardsVisible !== this.previousCardsVisible) {
            this.previousCardsVisible = currentCardsVisible
            this.index = 0
            this.track.style.transform = 'translateX(0px)'
            this.createDots()
        }

        this.update()
    }

    private createDots(): void {
        this.dotsContainer.innerHTML = ''
        this.dots = []

        const numDots = this.maxIndex + 1

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button')
            dot.className = 'carousel-dot'
            dot.setAttribute('role', 'tab')
            dot.setAttribute('aria-label', `Page ${i + 1}`)
            dot.setAttribute('aria-selected', i === this.index ? 'true' : 'false')
            
            if (i === this.index) {
                dot.classList.add('active')
            }

            dot.addEventListener('click', () => {
                this.goTo(i)
            })

            this.dotsContainer.appendChild(dot)
            this.dots.push(dot)
        }
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
        if (this.allCardsVisible) {
            this.nav.style.display = 'none'
            return
        }

        this.nav.style.display = ''

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

        // Only trigger swipe if horizontal movement is dominant
        // and significant enough
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
