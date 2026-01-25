import '../scss/all.scss'
import { setupAppointmentForm } from "./forms";
import { Carousel } from './carousels';

let prestationCarousel: Carousel;

document.addEventListener('DOMContentLoaded', () => {
    prestationCarousel = new Carousel(document.getElementById("prestationsCarousel")!);
    setupAppointmentForm();
})

window.addEventListener('resize', () => {
    prestationCarousel.onResize();
})