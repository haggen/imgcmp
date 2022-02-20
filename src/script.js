document.body.addEventListener(
  "dragenter",
  (event) => {
    event.target.classList.add("dropzone");
  },
  false
);

document.body.addEventListener(
  "dragleave",
  (event) => {
    event.target.classList.remove("dropzone");
  },
  false
);

document.body.addEventListener(
  "dragover",
  (event) => {
    event.preventDefault();
  },
  false
);

let nextImageIndex = 0;

/**
 *
 * @param {File} file
 */
const setNextImage = (file) => {
  if (!/image.*/.test(file.type)) {
    throw new Error("Not an image");
  }
  document.images[nextImageIndex].src = URL.createObjectURL(file);
  nextImageIndex = (nextImageIndex + 1) % document.images.length;
};

document.body.addEventListener(
  "drop",
  (event) => {
    event.preventDefault();
    event.target.classList.remove("dropzone");
    for (const file of event.dataTransfer.files) {
      setNextImage(file);
    }
  },
  false
);

document.addEventListener("paste", (event) => {
  for (const file of event.clipboardData.files) {
    setNextImage(file);
  }
});

document.body.addEventListener("mousemove", (event) => {
  const target = document.images[1];
  const clampedRelativeX = Math.min(
    Math.max(0, event.clientX - target.offsetLeft),
    target.offsetWidth
  );

  target.style.clipPath = `inset(0 ${
    target.offsetWidth - clampedRelativeX
  }px 0 0)`;
});
