const images = document.querySelectorAll(".js-carousel-img");
const nextButton = document.querySelector(".js-carousel-next");
const previousButton = document.querySelector(".js-carousel-previous");
const carouselIndex = document.querySelector(".js-carousel-index");

let currentImageIndex = 0;

nextButton.addEventListener("click", () => {
    handleNextButton();
    renderCurrentImageIndex();
});

// TODO: need to handle if user presses on previousButton first
previousButton.addEventListener("click", () => {
    handlePreviousButton();
    renderCurrentImageIndex();
});

function renderCurrentImageIndex() {
    carouselIndex.textContent = currentImageIndex;
}

function handleNextButton() {
    let nextImageIndex = currentImageIndex + 1;
    if (nextImageIndex === images.length) {
        nextImageIndex = 0;
    }

    let nextNextImageIndex = nextImageIndex + 1;
    if (nextNextImageIndex === images.length) {
        nextNextImageIndex = 0;
    }

    moveLeft(images[currentImageIndex]);
    moveLeft(images[nextImageIndex]);

    // prepare next image to come into the carousel
    moveToRightSideOfCarousel(images[nextNextImageIndex], nextNextImageIndex);

    currentImageIndex++;
    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }
}

function handlePreviousButton() {
    let nextImageIndex = currentImageIndex - 1;
    if (nextImageIndex < 0) {
        nextImageIndex = images.length - 1;
    }

    let nextNextImageIndex = nextImageIndex - 1;
    if (nextNextImageIndex < 0) {
        nextNextImageIndex = images.length - 1;
    }

    moveRight(images[currentImageIndex]);
    moveRight(images[nextImageIndex]);

    moveToLeftSideOfCarousel(images[nextNextImageIndex], nextNextImageIndex);

    currentImageIndex--;
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    }
}

function moveToLeftSideOfCarousel(node, index) {
    if (!node) {
        return;
    }

    const startingXOffset =  (index + 1) * 100 * -1;

    node.style.opacity = "0";
    node.style.transform = `translateX(${startingXOffset}%)`;
    node.addEventListener("transitionend", handleTransitionEnd)
}

function moveToRightSideOfCarousel(node, index) {
    if (!node) {
        return;
    }

    let startingXOffset = 0;
    if (index === 0) {
        startingXOffset = 100;
    } else {
        startingXOffset = (index - 1) * 100 * -1;
    }

    node.style.opacity = "0";
    node.style.transform = `translateX(${startingXOffset}%)`;
    node.addEventListener("transitionend", handleTransitionEnd)
}

function handleTransitionEnd() {
    this.removeEventListener("transitionend", handleTransitionEnd);
    this.style.opacity = "1";
}

function moveRight(node) {
    if (!node) {
        return;
    }

    const currentTransform = getTransform(node);
    const nextTransform = currentTransform + 100;

    node.style.transform = `translateX(${nextTransform}%)`;
}

function moveLeft(node) {
    if (!node) {
        return;
    }

    const currentTransform = getTransform(node);
    const nextTransform = currentTransform - 100;

    node.style.transform = `translateX(${nextTransform}%)`;
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