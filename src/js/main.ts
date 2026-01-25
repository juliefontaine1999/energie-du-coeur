import '../scss/all.scss'
import { setupAppointmentForm } from "./forms";
import { Carousel } from './carousels';

document.addEventListener('DOMContentLoaded', () => {
    new Carousel(document.getElementById("prestationsCarousel")!);
    setupAppointmentForm();
})
