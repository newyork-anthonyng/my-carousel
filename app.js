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
    // handle when image goes from left side of carousel to right side
    // we don't want it to overlap the visible images
    if (isOnRightOfCarousel(node)) {
        node.style.opacity = "0";
        node.addEventListener("transitionend", handleTransitionEnd);
    }

    moveToLeftOfCarouselWithOffset(node, 0);
}

function moveToRightOfCarousel(node) {
    // handle when image goes from right side of carousel to left side
    // we don't want it to overlap the visible images
    if (isOnLeftOfCarousel(node)) {
        node.style.opacity = "0";
        node.addEventListener("transitionend", handleTransitionEnd);
    }

    moveToLeftOfCarouselWithOffset(node, 400);
}

function isOnRightOfCarousel(node) {
    return getTransform(node) === leftOfCarouselTranslates[node.dataset.index] + 400;
}

function isOnLeftOfCarousel(node) {
    return leftOfCarouselTranslates[node.dataset.index] === getTransform(node);
}

function handleTransitionEnd() {
    this.removeEventListener("transitionend", handleTransitionEnd);
    this.style.opacity = "1";
}

function moveToLeftOfCarouselWithOffset(node, offset) {
    translateX(node, leftOfCarouselTranslates[node.dataset.index] + offset);
}

function moveToLeftMost(node) {
    moveToLeftOfCarouselWithOffset(node, 100);
}

function moveToCenter(node) {
    moveToLeftOfCarouselWithOffset(node, 200);
}

function moveToRightMost(node) {
    moveToLeftOfCarouselWithOffset(node, 300);
}

function translateX(node, amount) {
    node.style.transform = `translateX(${amount}%)`;
}

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

// initially position the images
positionImages(images);

nextButtonEle.addEventListener("click", moveCarouselForward);
previousButtonEle.addEventListener("click", moveCarouselBack);

function moveCarouselForward() {
    /*
    3 [ 1 2 3 ] 1 2
    becomes
    1 [ 2 3 1 ] 2 3
    */
    const newImages = [
        ...images.slice(1),
        images[0]
    ];
    images = newImages;
    positionImages(newImages);
}

function moveCarouselBack() {
    /*
    3 [ 1 2 3 ] 1 2
    becomes
    2 [ 3 1 2 ] 3 1
    */
    const newImages = [
        images[images.length - 1],
        ...images.slice(0, images.length - 1),
        
    ];
    images = newImages;
    positionImages(newImages);

}

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