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

function moveCarouselForward(images) {
    /*
    3 [ 1 2 3 ] 1 2
    becomes
    1 [ 2 3 1 ] 2 3
    */
    const newImages = [
        ...images.slice(1),
        images[0]
    ];
    return newImages;
}

function moveCarouselBack(images) {
    /*
    3 [ 1 2 3 ] 1 2
    becomes
    2 [ 3 1 2 ] 3 1
    */
    const newImages = [
        images[images.length - 1],
        ...images.slice(0, images.length - 1),
        
    ];
    return newImages;
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

class MyCarousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
        this.handlePreviousButtonClick = this.handlePreviousButtonClick.bind(this);

        this.shadowRoot.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                }

                .carousel {
                    width: 100%;
                    border: 5px solid pink;
                    overflow: hidden;
                }

                .carousel-inner {
                    border: 5px solid black;
                    display: flex;
                }

                .carousel-img {
                    border: 2px solid black;
                    display: flex;
                    justify-content: center;
                    flex: 0 0 50%;
                    transition: transform 0.3s ease-in-out;
                }
            </style>
            <div class="js-carousel carousel">
                <div class="js-carousel-inner carousel-inner">
                    <slot></slot>
                </div>
            </div>
            <button class="js-carousel-previous">Previous image</button>
            <button class="js-carousel-next">Next image</button>
        `
        this.previousButtonEle = this.shadowRoot.querySelector(".js-carousel-previous");
        this.nextButtonEle = this.shadowRoot.querySelector(".js-carousel-next");
        this.carouselInnerEle = this.shadowRoot.querySelector(".js-carousel-inner");

        // duplicate all images
        this.createDuplicateImages();

        this.images = [
            this.duplicatedImages[2],
            ...this.originalImages,
            this.duplicatedImages[0],
            this.duplicatedImages[1]
        ];

        positionImages(this.images);
        this.addEventListeners()
    }

    createDuplicateImages() {
        this.originalImages = this.querySelectorAll(".js-carousel-img");
        this.originalImages.forEach((image, index) => {
            image.setAttribute("data-index", index);
        });
        this.duplicatedImages = [...this.originalImages].map(image => {
            return image.cloneNode(true);
        });
        this.duplicatedImages.forEach((image, index) => {
            image.setAttribute("data-index", index + 3);
            this.carouselInnerEle.appendChild(image);
        });
    }

    addEventListeners() {
        this.nextButtonEle.addEventListener("click", this.handleNextButtonClick);
        this.previousButtonEle.addEventListener("click", this.handlePreviousButtonClick);
    }

    handleNextButtonClick() {
        this.images = moveCarouselForward(this.images);
        positionImages(this.images);
    }

    handlePreviousButtonClick() {
        this.images = moveCarouselBack(this.images);
        positionImages(this.images);
    }
}

window.customElements.define("my-carousel", MyCarousel);