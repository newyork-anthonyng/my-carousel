console.log("app.js loaded");

const carouselInner = document.querySelector(".js-carousel-inner");
const carouselImages = document.querySelectorAll(".js-carousel-img");

setTimeout(() => {
    carouselImages[0].style.transform = `translateX(-100%)`;
}, 1000);

// let index = 0;
// setInterval(() => {
//     if (index >= carouselImages.length) {
//         return;
//     }
// 
//     const currentImage = carouselImages[index];
//     const nextImage = carouselImages[index + 1];
// 
//     // move currentImage off view
//     currentImage.style.transform = `translateX(-${100 * index}%)`;
// 
//     // move nextImage out of view
//     nextImage.style.transform = `translateX(-${100 * index}%)`;
// 
//     index++;
// }, 1000);