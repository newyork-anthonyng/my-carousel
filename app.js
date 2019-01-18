const previousButtonEle = document.querySelector(".js-carousel-previous");
const nextButtonEle = document.querySelector(".js-carousel-next");
const carouselInnerEle = document.querySelector(".js-carousel-inner");

// duplicate all images
const originalImages = document.querySelectorAll(".js-carousel-img");
originalImages.forEach((image, index) => {
    image.setAttribute("data-index", index);
});
const duplicatedImages = [...originalImages].map(image => {
    return image.cloneNode(true);
});
duplicatedImages.forEach((image, index) => {
    image.setAttribute("data-index", index + 3);
    carouselInnerEle.appendChild(image);
});

const OFFSET = -50;
const leftOfCarouselTranslates = [
    -100 + OFFSET,
    -200 + OFFSET,
    -300 + OFFSET,
    -400 + OFFSET,
    -500 + OFFSET,
    -600 + OFFSET
];

function moveToLeftOfCarousel(node) {
    const index = node.dataset.index;

    const isOnRightOfCarousel = getTransform(node) === leftOfCarouselTranslates[index] + 400;
    console.log("is on right of carousel", isOnRightOfCarousel);
    if (isOnRightOfCarousel) {
        node.style.opacity = "0";
    }
    translateX(node, leftOfCarouselTranslates[index]);

    if (isOnRightOfCarousel) {
        node.addEventListener("transitionend", handleTransitionEnd);
    }
}

function moveToRightOfCarousel(node) {
    const index = node.dataset.index;

    const isOnLeftOfCarousel = leftOfCarouselTranslates[index] === getTransform(node);
    if (isOnLeftOfCarousel) {
        node.style.opacity = "0";
        
    }
    translateX(node, leftOfCarouselTranslates[index] + 400);

    if (isOnLeftOfCarousel) {
        node.addEventListener("transitionend", handleTransitionEnd);
    }
}

function handleTransitionEnd() {
    this.removeEventListener("transitionend", handleTransitionEnd);
    this.style.opacity = "1";
}

function moveToLeftMost(node) {
    const index = node.dataset.index;
    translateX(node, leftOfCarouselTranslates[index] + 100);
}

function moveToCenter(node) {
    const index = node.dataset.index;
    translateX(node, leftOfCarouselTranslates[index] + 200);
}

function moveToRightMost(node) {
    const index = node.dataset.index;
    translateX(node, leftOfCarouselTranslates[index] + 300);
}

function translateX(node, amount) {
    node.style.transform = `translateX(${amount}%)`;
}

/*
 [ ] represents the visible part of the carousel
 3 [ 1 2 3 ] 1 2
 go next
 1 [ 2 3 1 ] 2 3
*/
let images = [
    duplicatedImages[2],
    ...originalImages,
    duplicatedImages[0],
    duplicatedImages[1]
];

function positionImages(images) {
    const [
        leftSideOfCarousel,
        leftmostImage,
        centerImage,
        rightmostImage,
        rightSideOfCarousel,
        anotherRightSideOfCarousel
    ] = images;

    moveToLeftOfCarousel(leftSideOfCarousel);
    moveToLeftMost(leftmostImage)
    moveToCenter(centerImage)
    moveToRightMost(rightmostImage)
    moveToRightOfCarousel(rightSideOfCarousel)
    moveToRightOfCarousel(anotherRightSideOfCarousel);
}

positionImages(images);

nextButtonEle.addEventListener("click", () => {
    const newImages = [
        ...images.slice(1),
        images[0]
    ];
    images = newImages;
    positionImages(newImages);
});

previousButtonEle.addEventListener("click", () => {
    const newImages = [
        images[images.length - 1],
        ...images.slice(0, images.length - 1),
        
    ];
    images = newImages;
    positionImages(newImages);
});

const TRANSLATE_X_REGEX = /.*\((-?\d*)%\)/;
function getTransform(node) {
    if (!node) {
        return;
    }

    const { transform } = node.style;

    if (transform === "") {
        return 0;
    }

    const parsedTransform = TRANSLATE_X_REGEX.exec(transform);
    return +parsedTransform[1];
}