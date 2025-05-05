let currentImageIndex = 0;
const images = ["image1.jpg", "image2.jpg", "image3.jpg"];  

function changeImage(direction) {
  if (direction === 'left') {
    currentImageIndex = (currentImageIndex === 0) ? images.length - 1 : currentImageIndex - 1;
  } else if (direction === 'right') {
    currentImageIndex = (currentImageIndex === images.length - 1) ? 0 : currentImageIndex + 1;
  }


  document.getElementById('imageDisplay').src = images[currentImageIndex];
}
