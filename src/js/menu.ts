export class Menu {
    private toggle: HTMLButtonElement
    private menu: HTMLElement
    private links: NodeListOf<HTMLAnchorElement>

    constructor() {
        this.toggle = document.getElementById('menuToggle') as HTMLButtonElement
        this.menu = document.getElementById('menu') as HTMLElement
        this.links = this.menu.querySelectorAll('a')

        this.toggle.addEventListener('click', this.onToggle)
        this.links.forEach(link =>
            link.addEventListener('click', this.closeMenu)
        )
        document.addEventListener('click', this.onDocumentClick)
        window.addEventListener('resize', this.onResize)
    }

    private onToggle = (): void => {
        const isOpen = this.menu.classList.toggle('is-open')
        this.toggle.classList.toggle('is-open', isOpen)
        this.toggle.setAttribute('aria-expanded', String(isOpen))
    }

    private closeMenu = (): void => {
        this.menu.classList.remove('is-open')
        this.toggle.classList.remove('is-open')
        this.toggle.setAttribute('aria-expanded', 'false')
    }

    private onDocumentClick = (e: MouseEvent): void => {
        const target = e.target as Node

        if (!this.menu.contains(target) && !this.toggle.contains(target)) {
            this.closeMenu()
        }
    }

    private onResize = (): void => {
        if (window.innerWidth > 768) {
            this.menu.classList.remove('is-open')
            this.toggle.classList.remove('is-open')
            this.toggle.setAttribute('aria-expanded', 'false')
        }
    }
}
