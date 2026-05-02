import '../scss/all.scss'
import { Menu } from './menu';
import { setupAppointmentForm, setupGiftCardForm, initCsrfToken } from "./forms";
import { Carousel } from './carousels';
import { initCookieBanner } from './cookies';
import { initPrivacyModal } from './privacy';

let menu: Menu;

document.addEventListener('DOMContentLoaded', async () => {
    menu = new Menu();
    new Carousel(document.getElementById("prestationsCarousel")!);
    setupAppointmentForm();
    setupGiftCardForm();
    initCookieBanner();
    initPrivacyModal();
    await initCsrfToken();
})