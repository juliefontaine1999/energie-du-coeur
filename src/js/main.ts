import '../scss/all.scss'
import { Menu } from './menu';
import { setupAppointmentForm, setupGiftCardForm } from "./forms";
import { Carousel } from './carousels';
import { initCookieBanner } from './cookies';

let menu: Menu;

document.addEventListener('DOMContentLoaded', () => {
    menu = new Menu();
    new Carousel(document.getElementById("prestationsCarousel")!);
    setupAppointmentForm();
    setupGiftCardForm();
    initCookieBanner();
})