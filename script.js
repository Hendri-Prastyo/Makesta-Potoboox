let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "0",
    width: "0",
    videoId: "9Ebj__vqge0", // Ganti ID video musik YouTube
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      playlist: "Id4mjy6viLA"
    },
    events: {
      onReady: (event) => {
        event.target.setVolume(50); // volume 0 - 100
        event.target.playVideo();
      },
    },
  });
}


// 📸 Kamera
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const photos = [];
let step = 1;
const captureBtn = document.getElementById("capture-btn");
const cameraWrapper = document.getElementById("camera-wrapper");

navigator.mediaDevices.getUserMedia({ video: { facingMode:"user" } })
  .then(stream => video.srcObject = stream);

// Preview elemen
const previewContainer = document.getElementById("previewContainer");
const previewCanvas = document.getElementById("previewCanvas");
const retakeBtn = document.getElementById("retakeBtn");
const nextBtn = document.getElementById("nextBtn");

let lastCapturedImage = null;


// === COUNTDOWN ===
let countdownValue = 3;
let countdownInterval;
const countdownElement = document.getElementById("countdown");
countdownElement.style.display = "none";

function startCountdown(callback) {
  countdownValue = 3;
  countdownElement.textContent = countdownValue;
  countdownElement.style.display = "block";

  countdownInterval = setInterval(() => {
    countdownValue--;
    if (countdownValue > 0) {
      countdownElement.textContent = countdownValue;
    } else {
      clearInterval(countdownInterval);
      countdownElement.style.display = "none";
      callback();
    }
  }, 1000);
}


// === FLASH & SOUND ===
const flash = document.getElementById("flashOverlay");
const shutterSound = document.getElementById("shutterSound");

function startCapture(callback) {
  startCountdown(() => {
    flash.style.opacity = 1;
    setTimeout(() => flash.style.opacity = 0, 180);

    shutterSound.currentTime = 0;
    shutterSound.play();

    setTimeout(() => callback(), 200);
  });
}


// === PROSES FOTO ===
captureBtn.onclick = () => {
  startCapture(() => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    tempCanvas.getContext("2d").drawImage(video, 0, 0);
    lastCapturedImage = tempCanvas;

    previewCanvas.width = tempCanvas.width;
    previewCanvas.height = tempCanvas.height;
    previewCanvas.getContext("2d").drawImage(tempCanvas, 0, 0);

    cameraWrapper.style.display = "none";
    captureBtn.style.display = "none";
    previewContainer.style.display = "block";
  });
};

retakeBtn.onclick = () => {
  previewContainer.style.display = "none";
  cameraWrapper.style.display = "block";
  captureBtn.style.display = "block";
};

nextBtn.onclick = () => {
  photos.push(lastCapturedImage);
  previewContainer.style.display = "none";

  if (step < 3) {
    step++;
    captureBtn.textContent = `Ambil Foto`;
    captureBtn.style.display = "block";
    cameraWrapper.style.display = "block";
  } else {
    generateFinal();
  }
};





function generateFinal() {
  canvas.width = 1080;
  canvas.height = 1920;

  const photoW = 830;
  const photoH = 600;
  const posX = (canvas.width - photoW) / 2;

  ctx.drawImage(photos[0], posX, 90, photoW, photoH);
  ctx.drawImage(photos[1], posX, 660, photoW, photoH);
  ctx.drawImage(photos[2], posX, 1250, photoW, photoH);

  const frame = new Image();
  cameraWrapper.style.display = "none";
  frame.src = "frame.png";
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    document.getElementById("result").src = canvas.toDataURL("image/png");
    document.getElementById("result-area").style.display = "block";
    document.getElementById("result-area").classList.add("show");
  };
}

document.getElementById("download-btn").onclick = () => {
  const link = document.createElement("a");
  link.download = "Potobox-Strip.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
