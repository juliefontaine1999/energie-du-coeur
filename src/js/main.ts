import '../scss/all.scss'
import { Menu } from './menu';
import { setupAppointmentForm, setupGiftCardForm } from "./forms";
import { Carousel } from './carousels';

let menu: Menu;
let prestationCarousel: Carousel;

document.addEventListener('DOMContentLoaded', () => {
    menu = new Menu();
    prestationCarousel = new Carousel(document.getElementById("prestationsCarousel")!);
    setupAppointmentForm();
    setupGiftCardForm();
})

window.addEventListener('resize', () => {
    prestationCarousel.onResize();
})