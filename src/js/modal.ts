export type ModalType = 'success' | 'error'

export class ConfirmationModal {
    private overlay: HTMLElement
    private modal: HTMLElement
    private title: HTMLElement
    private message: HTMLElement
    private closeBtn: HTMLButtonElement

    constructor() {
        this.overlay = document.getElementById('modalOverlay') as HTMLElement
        this.modal = this.overlay.querySelector('.modal') as HTMLElement
        this.title = document.getElementById('modalTitle') as HTMLElement
        this.message = document.getElementById('modalMessage') as HTMLElement
        this.closeBtn = document.getElementById('modalCloseBtn') as HTMLButtonElement

        this.closeBtn.addEventListener('click', this.close)
        this.overlay.addEventListener('click', this.onOverlayClick)
        document.addEventListener('keydown', this.onKeyDown)
    }

    open(type: ModalType): void {
        if (type === 'success') {
            this.modal.className = 'modal success'
            this.title.textContent = 'Message envoyé !'
            this.message.innerHTML = `
        Merci pour votre message.<br>
        Je vous répondrai dans les plus brefs délais.
      `
        }

        if (type === 'error') {
            this.modal.className = 'modal error'
            this.title.textContent = 'Une erreur est survenue'
            this.message.textContent =
                'Votre message n’a pas pu être envoyé. Veuillez réessayer plus tard.'
        }

        this.overlay.classList.add('is-open')
        this.overlay.setAttribute('aria-hidden', 'false')
    }

    close = (): void => {
        this.overlay.classList.remove('is-open')
        this.overlay.setAttribute('aria-hidden', 'true')
    }

    private onOverlayClick = (e: MouseEvent): void => {
        if (e.target === this.overlay) {
            this.close()
        }
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            this.close()
        }
    }
}
