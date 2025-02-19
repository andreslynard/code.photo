// Page Navigation
const homePage = document.getElementById('home-page');
const welcomePage = document.getElementById('welcome-page');
const picturePage = document.getElementById('picture-page');
const collagePage = document.getElementById('collage-page');
const startHomeBtn = document.getElementById('start-home');
const startWelcomeBtn = document.getElementById('start-welcome');
const captureBtn = document.getElementById('capture-btn');
const downloadBtn = document.getElementById('download-btn');
const homeBtn = document.getElementById('home-btn');
const countdownDiv = document.getElementById('countdown');

let images = [];
let countdownTimer = null;

// Theme variables - defining them globally
const collageTheme = {
  backgroundColor: '#ffb6e1', // Pink background like in reference
  photoBackgroundColor: '#0046ad', // Blue background for empty photos
  borderColor: '#ffffff', // White borders
  textColor: '#ffffff', // White text
  fontFamily: 'Montserrat, sans-serif'
};

// Navigate from Home to Welcome Page
startHomeBtn.addEventListener('click', () => {
  homePage.style.display = 'none';
  welcomePage.style.display = 'flex';
});

// Navigate from Welcome to Picture Page
startWelcomeBtn.addEventListener('click', () => {
  welcomePage.style.display = 'none';
  picturePage.style.display = 'flex';
});

// Access camera
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photosContainer = document.getElementById('photos');
const finalCanvas = document.getElementById('final-canvas');

// Check if the browser supports mediaDevices
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

// Improved countdown function without setInterval lag
function startCountdown(photosRemaining) {
  if (photosRemaining <= 0) {
    countdownDiv.textContent = "All photos captured!";
    captureBtn.disabled = false;
    composeFinalImage();
    return;
  }

  let seconds = 3; // 3-second countdown per photo
  updateCountdown();

  function updateCountdown() {
    if (seconds > 0) {
      countdownDiv.textContent = `Taking photo in ${seconds} seconds...`;
      seconds--;
      // Using requestAnimationFrame with timestamp check for more accurate timing
      const startTime = Date.now();
      const nextUpdate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= 1000) {
          updateCountdown();
        } else {
          requestAnimationFrame(nextUpdate);
        }
      };
      requestAnimationFrame(nextUpdate);
    } else {
      // Take the photo
      capturePhoto();
      countdownDiv.textContent = `Photo ${5 - photosRemaining} captured!`;
      
      // Wait a moment to show the "captured" message before starting next countdown
      setTimeout(() => {
        startCountdown(photosRemaining - 1);
      }, 1000);
    }
  }

  function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image and store in array
    const imgUrl = canvas.toDataURL('image/png');
    images.push(imgUrl);

    // Display individual photo
    const img = document.createElement('img');
    img.src = imgUrl;
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.objectFit = 'cover';
    img.style.border = '3px solid ' + collageTheme.borderColor;
    img.style.borderRadius = '5px';
    photosContainer.appendChild(img);
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

function composeFinalImage() {
  const finalCanvas = document.getElementById('final-canvas');
  const finalContext = finalCanvas.getContext('2d');

  // Set canvas size to match the image reference (mobile portrait format)
  finalCanvas.width = 500;
  finalCanvas.height = 900;

  // Fill background with theme color
  finalContext.fillStyle = collageTheme.backgroundColor;
  finalContext.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Define photo positions (vertical layout like in reference)
  const photoPositions = [
    { x: 20, y: 20, width: finalCanvas.width - 40, height: 220 },
    { x: 20, y: 250, width: finalCanvas.width - 40, height: 220 },
    { x: 20, y: 480, width: finalCanvas.width - 40, height: 220 },
    { x: 20, y: 710, width: finalCanvas.width - 40, height: 220 }
  ];

  // Draw each photo frame with placeholder text if needed
  photoPositions.forEach((position, index) => {
    const { x, y, width, height } = position;
    
    // Draw rounded blue background (like in reference)
    finalContext.fillStyle = collageTheme.photoBackgroundColor;
    roundRect(finalContext, x, y, width, height, 20);
    finalContext.fill();
    
    // Draw placeholder text if image not available
    if (index >= images.length) {
      finalContext.fillStyle = collageTheme.textColor;
      finalContext.font = '30px ' + collageTheme.fontFamily;
      finalContext.textAlign = 'center';
      finalContext.textBaseline = 'middle';
      finalContext.fillText('insert photo', x + width/2, y + height/2);
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
        roundRect(finalContext, x, y, width, height, 20);
        finalContext.clip();
        finalContext.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
        finalContext.restore();
      };
      
      if (img.complete) {
        img.onload();
      }
    }
  });
  
  // Add "photbooth" text at bottom like in reference
  finalContext.fillStyle = collageTheme.textColor;
  finalContext.font = '24px ' + collageTheme.fontFamily;
  finalContext.textAlign = 'center';
  finalContext.textBaseline = 'middle';
  finalContext.fillText('photbooth', finalCanvas.width/2, finalCanvas.height - 30);
  
  // Switch to collage view
  picturePage.style.display = 'none';
  collagePage.style.display = 'flex';
}

// Download Collage
downloadBtn.addEventListener('click', () => {
  const imgUrl = finalCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imgUrl;
  link.download = 'korean-photobooth-collage.png';
  link.click();
});

// Back to Home
homeBtn.addEventListener('click', () => {
  collagePage.style.display = 'none';
  homePage.style.display = 'flex';
  
  // Clear photos container
  photosContainer.innerHTML = '';
});