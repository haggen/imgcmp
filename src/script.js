let nextImageId = 0;

/**
 * Update image with given file and bump next id.
 * @param {File} file
 */
function updateNextImage(file) {
  const image = document.images[nextImageId];
  const src = URL.createObjectURL(file);
  image.onload = () => {
    // Gotta dispose of URL object manually, otherwise memory leaks.
    URL.revokeObjectURL(src);
  };
  image.src = src;

  nextImageId = (nextImageId + 1) % document.images.length;
}

/**
 * Handle data transfer from any event.
 * @param {DataTransfer} data
 */
function handleDataTransfer(data) {
  // If we're transfering more than 1 we should reset the order, so the first image alawys stays under the second.
  if (data.files.length > 1) {
    nextImageId = 0;
  }
  for (const file of data.files) {
    if (!/image.*/.test(file.type)) {
      throw new Error("Not an image");
    }
    updateNextImage(file);
  }
}

/**
 * Prevent browser's default handling.
 */
document.body.addEventListener("dragover", (event) => {
  event.preventDefault();
});

/**
 * Handle file drop.
 */
document.body.addEventListener("drop", (event) => {
  event.preventDefault();
  handleDataTransfer(event.dataTransfer);
});

/**
 * Handle file paste.
 */
document.addEventListener("paste", (event) => {
  event.preventDefault();
  handleDataTransfer(event.clipboardData);
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
 * Show nothing if we don't have JavaScript.
 */
document.body.prepend(
  document.createTextNode("Drop or paste images to compare.")
);
document.body.appendChild(new Image());
document.body.appendChild(new Image());

/**
 * Enable hot reloading.
 * @see https://parceljs.org/features/development/#hot-reloading
 */
if (typeof module !== "undefined" && module.hot) {
  module.hot.accept();
}
