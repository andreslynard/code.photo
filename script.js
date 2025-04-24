// Collage dimensions in pixels (assuming 1 cm = 37.8 pixels for standard DPI)
const collageWidth = 5 * 37.8; // 5 cm in pixels
const collageHeight = 18 * 37.8; // 15 cm in pixels
const photoWidth = 4.5 * 37.8; // 4.5 cm in pixels
const photoHeight = 3.5 * 37.8; // 3.5 cm in pixels
const photoGap = 2.5 * 37.8 / 10; // 2.5 mm in pixels
const bottomSectionHeight = 1.75 * 37.8; // 1.75 cm in pixels

// Theme variables
const collageTheme = {
  backgroundColor: '#ffb6e1', // Background color of the collage
  borderColor: '#ffffff', // Border color for photo frames
  textColor: '#ffffff', // Text color for placeholder and bottom text
  fontFamily: 'Montserrat, sans-serif', // Font family for text
  bottomText: 'loves photobooth' // Text to display at the bottom
};

// Page Navigation
const homePage = document.getElementById('home-page');
const welcomePage = document.getElementById('welcome-page');
const picturePage = document.getElementById('picture-page');
const collagePage = document.getElementById('collage-page');
const startHomeBtn = document.getElementById('start-home'); // Correct ID
const startWelcomeBtn = document.getElementById('start-welcome');
const captureBtn = document.getElementById('capture-btn');
const downloadBtn = document.getElementById('download-btn');
const backToHomeBtn = document.getElementById('back-to-home');
const countdownDiv = document.getElementById('countdown');

let images = [];
let countdownTimer = null;

// Navigate from Home to Welcome Page
startHomeBtn.addEventListener('click', () => {
  homePage.style.display = 'none'; // Hide the home page
  welcomePage.style.display = 'flex'; // Show the welcome page
});

// Navigate from Welcome to Picture Page
startWelcomeBtn.addEventListener('click', () => {
  welcomePage.style.display = 'none'; // Hide the welcome page
  picturePage.style.display = 'flex'; // Show the picture page
});

// Access camera
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photosContainer = document.getElementById('photos');
const finalCanvas = document.getElementById('final-canvas');

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error("getUserMedia is not supported in this browser.");
} else {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("Error accessing the camera: ", err);
      alert("Unable to access the camera. Please ensure your camera is connected and permissions are granted.");
    });
}

// Capture photo with improved countdown
captureBtn.addEventListener('click', () => {
  if (!video.srcObject) {
    console.error("Camera stream is not available.");
    alert("Camera is not ready. Please ensure the camera is connected and permissions are granted.");
    return;
  }

  images = []; // Reset images array
  photosContainer.innerHTML = ''; // Clear previous photos
  captureBtn.disabled = true; // Disable button during capture
  startCountdown(4); // Start capturing 4 photos
});

// Improved countdown function
function startCountdown(photosRemaining) {
  if (photosRemaining <= 0) {
    countdownDiv.textContent = "All photos captured!";
    captureBtn.disabled = false;
    composeFinalImage();

    // Navigate to the Collage Page
    picturePage.style.display = 'none';
    collagePage.style.display = 'flex'; // Show the collage page
    return;
  }

  let seconds = 3; // 3-second countdown per photo
  updateCountdown();

  function updateCountdown() {
    if (seconds > 0) {
      countdownDiv.textContent = `Taking photo in ${seconds} seconds...`;
      seconds--;
      setTimeout(updateCountdown, 1000);
    } else {
      capturePhoto();
      countdownDiv.textContent = `Photo ${5 - photosRemaining} captured!`;
      setTimeout(() => {
        startCountdown(photosRemaining - 1);
      }, 1000);
    }
  }

  function capturePhoto() {
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
  
    // Set temporary canvas dimensions to match the video
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
  
    // Draw the current video frame onto the temporary canvas
    tempContext.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
  
    // Convert the temporary canvas to a data URL
    const imgUrl = tempCanvas.toDataURL('image/png');
  
    // Add the captured image to the images array
    images.push(imgUrl);
  
    // Create an image element for the photo preview
    const img = document.createElement('img');
    img.src = imgUrl;
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.objectFit = 'cover';
    img.style.border = '3px solid ' + collageTheme.borderColor;
    img.style.borderRadius = '5px';
  
    // Append the image to the photos container
    document.getElementById('photos').appendChild(img);
  }
}

// Draw rounded rectangle
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Collage Configuration
const collageConfig = {
  width: 5 * 37.8, // 5 cm in pixels
  height: 18 * 37.8, // 18 cm in pixels
  photoWidth: 4.5 * 37.8, // 4.5 cm in pixels
  photoHeight: 3.5 * 37.8, // 3.5 cm in pixels
  photoGap: 2.5 * 37.8 / 10, // 2.5 mm in pixels
  bottomSectionHeight: 1.75 * 37.8, // 1.75 cm in pixels
  backgroundColor: '#ffb6e1',
  gradientBackground: null,
  textColor: '#ffffff',
  fontFamily: 'Montserrat, sans-serif',
  placeholderText: 'insert photo',
  bottomText: 'loves photobooth',
  numberOfPhotos: 4,
  photoPositions: []
};

// Get references to input fields
const backgroundColorInput = document.getElementById('backgroundColor');
const textColorInput = document.getElementById('textColor');
const bottomTextInput = document.getElementById('bottomText');
const numberOfPhotosInput = document.getElementById('numberOfPhotos');
const gradientColor1Input = document.getElementById('gradientColor1');
const gradientColor2Input = document.getElementById('gradientColor2');
const useGradientInput = document.getElementById('useGradient');

// Initialize input fields with default values
backgroundColorInput.value = collageConfig.backgroundColor;
textColorInput.value = collageConfig.textColor;
bottomTextInput.value = collageConfig.bottomText;
numberOfPhotosInput.value = collageConfig.numberOfPhotos;

// Calculate initial photo positions
collageConfig.photoPositions = calculatePhotoPositions(collageConfig);

gradientColor1Input.addEventListener('input', () => {
  if (useGradientInput.checked) {
    collageConfig.gradientBackground = {
      color1: gradientColor1Input.value,
      color2: gradientColor2Input.value
    };
    composeFinalImage();
  }
});

gradientColor2Input.addEventListener('input', () => {
  if (useGradientInput.checked) {
    collageConfig.gradientBackground = {
      color1: gradientColor1Input.value,
      color2: gradientColor2Input.value
    };
    composeFinalImage();
  }
});

useGradientInput.addEventListener('change', () => {
  if (useGradientInput.checked) {
    collageConfig.gradientBackground = {
      color1: gradientColor1Input.value,
      color2: gradientColor2Input.value
    };
  } else {
    collageConfig.gradientBackground = null;
  }
  composeFinalImage();
});

// Function to calculate photo positions
function calculatePhotoPositions(config) {
  const { width, height, photoWidth, photoHeight, photoGap, bottomSectionHeight, numberOfPhotos } = config;
  const positions = [];
  const startY = 10; // Top margin in pixels

  for (let i = 0; i < numberOfPhotos; i++) {
    positions.push({
      x: (width - photoWidth) / 2, // Center photos horizontally
      y: startY + i * (photoHeight + photoGap), // Stack photos vertically
      width: photoWidth,
      height: photoHeight
    });
  }

  return positions;
}

// Function to compose the final image
function composeFinalImage() {
  const finalCanvas = document.getElementById('final-canvas');
  const finalContext = finalCanvas.getContext('2d');

  // Set canvas size to match the collage dimensions
  finalCanvas.width = collageConfig.width;
  finalCanvas.height = collageConfig.height;

  // Clear the canvas
  finalContext.clearRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Fill background with solid color or gradient
  if (collageConfig.gradientBackground) {
    // Create gradient that extends to the entire canvas
    const gradient = finalContext.createLinearGradient(0, 0, finalCanvas.width, finalCanvas.height);
    gradient.addColorStop(0, collageConfig.gradientBackground.color1);
    gradient.addColorStop(1, collageConfig.gradientBackground.color2);
    finalContext.fillStyle = gradient;
  } else {
    // Use solid background color for the entire canvas
    finalContext.fillStyle = collageConfig.backgroundColor;
  }
  // Fill the entire canvas with the selected background
  finalContext.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Draw each photo frame
  collageConfig.photoPositions.forEach((position, index) => {
    const { x, y, width, height } = position;

    // Draw placeholder text if no image is available
    if (index >= images.length) {
      finalContext.fillStyle = collageConfig.textColor;
      finalContext.font = `20px ${collageConfig.fontFamily}`;
      finalContext.textAlign = 'center';
      finalContext.textBaseline = 'middle';
      finalContext.fillText(collageConfig.placeholderText, x + width / 2, y + height / 2);
    } else {
      // Load and draw the actual photo
      const img = new Image();
      img.src = images[index];
      img.onload = () => {
        // Calculate aspect ratio to prevent stretching
        const imgRatio = img.width / img.height;
        const frameRatio = width / height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > frameRatio) {
          // Image is wider than frame
          drawHeight = height;
          drawWidth = height * imgRatio;
          offsetX = (width - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller than frame
          drawWidth = width;
          drawHeight = width / imgRatio;
          offsetX = 0;
          offsetY = (height - drawHeight) / 2;
        }

        // Draw the image centered in the frame
        finalContext.save();
        finalContext.beginPath();
        roundRect(finalContext, x, y, width, height, 10);
        finalContext.clip();
        finalContext.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
        finalContext.restore();
      };

      if (img.complete) {
        img.onload();
      }
    }
  });

  // Draw the bottom section for text/logo
  if (!collageConfig.gradientBackground) {
    // If no gradient is used, fill the bottom section with the background color
    finalContext.fillStyle = collageConfig.backgroundColor;
    finalContext.fillRect(
      0,
      finalCanvas.height - collageConfig.bottomSectionHeight,
      finalCanvas.width,
      collageConfig.bottomSectionHeight
    );
  }

  // Add text at the bottom
  finalContext.fillStyle = collageConfig.textColor;
  finalContext.font = `15px ${collageConfig.fontFamily}`;
  finalContext.textAlign = 'center';
  finalContext.textBaseline = 'middle';
  finalContext.fillText(
    collageConfig.bottomText,
    finalCanvas.width / 2,
    finalCanvas.height - collageConfig.bottomSectionHeight / 2 - 25
  );
}

// Update the collage in real-time as users adjust inputs
backgroundColorInput.addEventListener('input', () => {
  collageConfig.backgroundColor = backgroundColorInput.value;
  composeFinalImage();
});

textColorInput.addEventListener('input', () => {
  collageConfig.textColor = textColorInput.value;
  composeFinalImage();
});

bottomTextInput.addEventListener('input', () => {
  collageConfig.bottomText = bottomTextInput.value;
  composeFinalImage();
});

numberOfPhotosInput.addEventListener('input', () => {
  collageConfig.numberOfPhotos = parseInt(numberOfPhotosInput.value, 10);
  collageConfig.photoPositions = calculatePhotoPositions(collageConfig);
  composeFinalImage();
});

// Initial render
composeFinalImage();

// Download Collage
downloadBtn.addEventListener('click', () => {
  const imgUrl = finalCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imgUrl;
  link.download = 'photobooth-collage.png';
  link.click();
});

// Add event listener for the "Back to Home" button
backToHomeBtn.addEventListener('click', () => {
  collagePage.style.display = 'none';
  homePage.style.display = 'flex';
  photosContainer.innerHTML = ''; // Clear the photos container
  images = []; // Reset the images array
  countdownDiv.textContent = ''; // Clear the countdown text
  captureBtn.disabled = false; // Re-enable the capture button

  // Clear the canvas (if used)
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Clear the final collage canvas
  const finalCanvas = document.getElementById('final-canvas');
  const finalContext = finalCanvas.getContext('2d');
  finalContext.clearRect(0, 0, finalCanvas.width, finalCanvas.height); // Clear the final canvas
});