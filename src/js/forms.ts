import { ConfirmationModal } from './modal';

let csrfToken = '';

export async function initCsrfToken(): Promise<void> {
    try {
        const response = await fetch('https://server.energie-du-coeur.ch/csrf-token', {
            credentials: 'same-origin'
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du token CSRF');
        }
        const data = await response.json();
        csrfToken = data.token;
    } catch (error) {
        console.warn('Impossible de récupérer le token CSRF');
    }
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateRequired(value: string): boolean {
    return value.trim().length > 0;
}

export function validateLength(value: string, min: number | undefined, max: number | undefined): boolean {
    const trimmed = value.trim();
    let isValid: boolean = true;
    if (min !== undefined) {
        isValid = isValid && trimmed.length >= min;
    }

    if (max !== undefined) {
        isValid = isValid && trimmed.length <= max;
    }

    return isValid;
}

function showFieldError(input: HTMLInputElement | HTMLTextAreaElement, message: string): void {
    input.setAttribute('aria-invalid', 'true');
    let errorEl = input.parentElement?.querySelector('.field-error') as HTMLElement;
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.setAttribute('role', 'alert');
        input.parentElement?.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

function clearFieldError(input: HTMLInputElement | HTMLTextAreaElement): void {
    input.removeAttribute('aria-invalid');
    const errorEl = input.parentElement?.querySelector('.field-error') as HTMLElement;
    if (errorEl) {
        errorEl.remove();
    }
}

function showFieldsetError(fieldset: HTMLFieldSetElement, message: string): void {
    fieldset.setAttribute('aria-invalid', 'true');
    let errorEl = fieldset.querySelector('.field-error') as HTMLElement;
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error col-12';
        errorEl.setAttribute('role', 'alert');
        fieldset.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

function clearFieldSetError(fieldset: HTMLFieldSetElement): void {
    fieldset.removeAttribute('aria-invalid');
    const errorEl = fieldset.querySelector('.field-error') as HTMLElement;
    if (errorEl) {
        errorEl.remove();
    }
}

function validateField(input: HTMLInputElement | HTMLTextAreaElement, rules: {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
}): boolean {
    const value = input.value;
    clearFieldError(input);

    if (rules.required && !validateRequired(value)) {
        showFieldError(input, 'Ce champ est requis');
        return false;
    }

    if (rules.email && !validateEmail(value)) {
        showFieldError(input, 'Veuillez entrer une adresse e-mail valide');
        return false;
    }

    if (rules.minLength !== undefined && !validateLength(value, rules.minLength, undefined)) {
        showFieldError(input, `Ce champ doit contenir au moins ${rules.minLength} caractères`);
        return false;
    }

    if (rules.maxLength !== undefined && !validateLength(value, 0, rules.maxLength)) {
        showFieldError(input, `Ce champ ne peut pas dépasser ${rules.maxLength} caractères`);
        return false;
    }

    return true;
}

export function validateCheckboxRequired(checkboxes: HTMLInputElement[]): boolean {
    return checkboxes.some(checkbox => checkbox.checked);
}

function validateCheckboxes(fieldset: HTMLFieldSetElement, rules: {
    required?: boolean;
}): boolean {
    clearFieldSetError(fieldset);

    const checkboxes = Array.from(fieldset.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]'
    ));

    if (rules.required && !validateCheckboxRequired(checkboxes)) {
        showFieldsetError(fieldset, 'Veuillez sélectionner au moins une option');
        return false;
    }

    return true;
}

type AppointmentFormPayload = {
    firstname: string
    lastname: string
    mail: string
    message: string
    energeticCare?: boolean
    cardDrawing?: boolean
    numerology?: boolean
    remoteCare?: boolean
    energy: string
}

async function submitAppointmentRequestForm(
    form: HTMLFormElement
): Promise<void> {
    const formData = new FormData(form)

    const energeticCareChbx = form.querySelector<HTMLInputElement>('#energeticCareChbx')
    const cardDrawingChbx = form.querySelector<HTMLInputElement>('#cardDrawingChbx')
    const numerologyChbx = form.querySelector<HTMLInputElement>('#numerologyChbx')
    const remoteCareChbx = form.querySelector<HTMLInputElement>('#remoteCareChbx')

    const payload: AppointmentFormPayload = {
        firstname: String(formData.get('firstname') ?? ''),
        lastname: String(formData.get('lastname') ?? ''),
        mail: String(formData.get('mail') ?? ''),
        message: String(formData.get('message') ?? ''),
        energeticCare: energeticCareChbx?.checked ?? false,
        cardDrawing: cardDrawingChbx?.checked ?? false,
        numerology: numerologyChbx?.checked ?? false,
        remoteCare: remoteCareChbx?.checked ?? false,
        energy: String(formData.get('energy') ?? '')
    }

    const response = await fetch('https://server.energie-du-coeur.ch/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
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

    const firstname = form.querySelector<HTMLInputElement>('#firstname')!;
    const lastname = form.querySelector<HTMLInputElement>('#lastname')!;
    const mail = form.querySelector<HTMLInputElement>('#mail')!;
    const message = form.querySelector<HTMLTextAreaElement>('#message')!;
    const services = form.querySelector<HTMLFieldSetElement>('#services')!;

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        let isValid = true;
        isValid = validateField(firstname, { required: true, minLength: 2, maxLength: 100 }) && isValid;
        isValid = validateField(lastname, { required: true, minLength: 2, maxLength: 100 }) && isValid;
        isValid = validateField(mail, { required: true, email: true, minLength: 6, maxLength: 100 }) && isValid;
        isValid = validateField(message, { required: true, minLength: 4, maxLength: 2000 }) && isValid;
        isValid = validateCheckboxes(services, { required: true }) && isValid;

        if (!isValid) return

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

    const response = await fetch('https://server.energie-du-coeur.ch/giftCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
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

    const firstname = form.querySelector<HTMLInputElement>('#gc-firstname')!;
    const lastname = form.querySelector<HTMLInputElement>('#gc-lastname')!;
    const amount = form.querySelector<HTMLInputElement>('#amount')!;
    const mail = form.querySelector<HTMLInputElement>('#gc-mail')!;
    const message = form.querySelector<HTMLTextAreaElement>('#gc-message')!;

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        let isValid = true;
        isValid = validateField(firstname, { required: true, minLength: 2, maxLength: 100 }) && isValid;
        isValid = validateField(lastname, { required: true, minLength: 2, maxLength: 100 }) && isValid;
        isValid = validateField(amount, { required: true, minLength: 1, maxLength: 10 }) && isValid;
        isValid = validateField(mail, { required: true, email: true, minLength: 6, maxLength: 100 }) && isValid;
        isValid = validateField(message, { required: true, minLength: 4, maxLength: 2000 }) && isValid;

        if (!isValid) return

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