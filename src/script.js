let nextImageIndex = 0;

/**
 * Update next image with given file and bump the index.
 * @param {File} file
 */
const setNextImage = (file) => {
  if (!/image.*/.test(file.type)) {
    throw new Error("Not an image");
  }
  const image = document.images[nextImageIndex];
  const src = URL.createObjectURL(file);
  image.onload = () => {
    URL.revokeObjectURL(src);
  };
  image.src = src;

  nextImageIndex = (nextImageIndex + 1) % document.images.length;
};

/**
 * Prevent browser default handling.
 */
document.body.addEventListener("dragover", (event) => {
  event.preventDefault();
});

/**
 * Handle file drop.
 */
document.body.addEventListener("drop", (event) => {
  event.preventDefault();
  for (const file of event.dataTransfer.files) {
    setNextImage(file);
  }
});

/**
 * Handle file paste.
 */
document.addEventListener("paste", (event) => {
  for (const file of event.clipboardData.files) {
    setNextImage(file);
  }
});

/**
 * Handle slider.
 */
document.body.addEventListener("mousemove", (event) => {
  const target = document.images[1];
  const clampedX = Math.min(
    Math.max(0, event.clientX - target.offsetLeft),
    target.offsetWidth
  );
  target.style.clipPath = `inset(0 ${target.offsetWidth - clampedX}px 0 0)`;
});

/**
 * Don't show instructions if JavaScript is disabled.
 */
document.body.prepend(
  document.createTextNode("Drop or paste images to compare.")
);

/**
 * Enable hot reloading.
 * @see https://parceljs.org/features/development/#hot-reloading
 */
if (typeof module !== "undefined" && module.hot) {
  module.hot.accept();
}
