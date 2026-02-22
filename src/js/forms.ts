import { ConfirmationModal } from './modal';

type AppointmentFormPayload = {
    firstname: string
    lastname: string
    mail: string
    message: string
    energeticCare: string
    cardDrawing: string
    numerology: string
    remoteCare: string
    energy: string
}

async function submitAppointmentRequestForm(
    form: HTMLFormElement
): Promise<void> {
    const formData = new FormData(form)

    const payload: AppointmentFormPayload = {
        firstname: String(formData.get('firstname') ?? ''),
        lastname: String(formData.get('lastname') ?? ''),
        mail: String(formData.get('mail') ?? ''),
        message: String(formData.get('message') ?? ''),
        energeticCare: String(formData.get('energeticCareChbx') ?? ''),
        cardDrawing: String(formData.get('cardDrawingChbx') ?? ''),
        numerology: String(formData.get('numerologyChbx') ?? ''),
        remoteCare: String(formData.get('remoteCareChbx') ?? ''),
        energy: String(formData.get('energy') ?? '')
    }

    const response = await fetch('http://localhost:8081/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })


    if (!response.ok) {
        throw new Error('Erreur lors de l’envoi du formulaire')
    }
}

export function setupAppointmentForm(): void {
    const form = document.querySelector<HTMLFormElement>(
        '#appointmentForm'
    )

    if (!form) return

    const modal = new ConfirmationModal()

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        try {
            await submitAppointmentRequestForm(form)
            form.reset()
            modal.open('success')
        } catch (error) {
            console.error(error)
            modal.open('error')
        }
    })
}

type GiftCardFormPayload = {
    firstname: string
    lastname: string
    amount: string
    mail: string
    message: string
    energy: string
}

async function submitGiftCardRequestForm(
    form: HTMLFormElement
): Promise<void> {
    const formData = new FormData(form)

    const payload: GiftCardFormPayload = {
        firstname: String(formData.get('firstname') ?? ''),
        lastname: String(formData.get('lastname') ?? ''),
        amount: String(formData.get('amount') ?? ''),
        mail: String(formData.get('mail') ?? ''),
        message: String(formData.get('message') ?? ''),
        energy: String(formData.get('energy') ?? '')
    }

    const response = await fetch('http://localhost:8081/giftCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })


    if (!response.ok) {
        throw new Error('Erreur lors de l’envoi du formulaire')
    }
}

export function setupGiftCardForm(): void {
    const form = document.querySelector<HTMLFormElement>(
        '#giftCardForm'
    )

    if (!form) return

    const modal = new ConfirmationModal()

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        try {
            await submitGiftCardRequestForm(form)
            form.reset()
            modal.open('success')
        } catch (error) {
            console.error(error)
            modal.open('error')
        }
    })
}