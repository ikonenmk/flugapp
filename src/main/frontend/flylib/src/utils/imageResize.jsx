
export default function ImageResize(image, targetWidth, targetHeight, canvasId) {
    // Get a canvas element and context
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    // Calculate the aspect ratio
    const imageAspectRatio = image.width / image.height;
    const targetAspectRatio = targetWidth / targetHeight;

    let sourceX, sourceY, sourceWidth, sourceHeight;

    // If image is wider than target crop width of image
    if (imageAspectRatio > targetAspectRatio) {
        sourceHeight = image.height;
        sourceWidth = image.height * targetAspectRatio;
        sourceX = (image.width - sourceWidth) / 2;
        sourceY = 0;
    } else {
        // If image is taller than target crop height
        sourceWidth = image.width;
        sourceHeight = image.width / targetAspectRatio;
        sourceX = 0;
        sourceY = (image.height - sourceHeight) / 2;
    }

    // Set canvas dimensions
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Draw new image
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        targetWidth,
        targetHeight
    );

    // Return the resized image as dataUrl
    return canvas.toDataURL();
}
