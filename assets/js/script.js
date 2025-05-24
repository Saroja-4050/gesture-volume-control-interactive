"use strict";

// DOM refs
const videoElement  = document.getElementById("webcamInput");
const canvasElement = document.getElementById("outputCanvas");
const canvasCtx     = canvasElement.getContext("2d");
const gestureNameEl = document.getElementById("gestureName");
const volumeBarEl   = document.getElementById("volumeBar");
const volumePctEl   = document.getElementById("volumePercentage");
const muteStatusEl  = document.getElementById("muteStatus");
const audioEl       = document.getElementById("sampleAudio");

// State
let currentVolume = 0.5;
let isMuted       = false;

// Simple 3D distance
function getDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z||0) - (b.z||0);
  return Math.hypot(dx, dy, dz);
}

// --- MediaPipe Hands setup ---
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
  maxNumHands:            1,
  modelComplexity:        0,
  minDetectionConfidence: 0.7,
  minTrackingConfidence:  0.7
});
hands.onResults(onResults);

// Draw & logic per frame
function onResults(results) {
  // resize canvas
  if (canvasElement.width  !== videoElement.videoWidth ||
      canvasElement.height !== videoElement.videoHeight) {
    canvasElement.width  = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
  }

  // mirror & draw camera
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.translate(canvasElement.width, 0);
  canvasCtx.scale(-1, 1);
  canvasCtx.drawImage(
    results.image, 0, 0,
    canvasElement.width, canvasElement.height
  );

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const lm = results.multiHandLandmarks[0];

    // blue skeleton + white joints
    drawConnectors(canvasCtx, lm, HAND_CONNECTIONS, {
      color: "#61dafb", lineWidth: 4
    });
    drawLandmarks(canvasCtx, lm, {
      color: "#ffffff", lineWidth: 1, radius: 5
    });

    // thumb‑index distance → volume
    const d = getDistance(lm[4], lm[8]);
    // map 0.02–0.25 → [0,1]
    const norm = Math.min(Math.max((d - 0.02)/(0.25 - 0.02), 0), 1);
    currentVolume = norm;
    audioEl.volume = currentVolume;
    volumeBarEl.value  = currentVolume * 100;
    volumePctEl.textContent = `${Math.round(currentVolume*100)}%`;

    // simple fist/palm: if 4+ fingertips <0.06 from palm → mute
    const palm = lm[0];
    const folded = [4,8,12,16,20].filter(i =>
      getDistance(lm[i], palm) < 0.06
    ).length;
    isMuted = folded >= 4;
    audioEl.muted = isMuted;
    muteStatusEl.textContent = isMuted ? "Muted" : "Unmuted";

    gestureNameEl.textContent = isMuted
      ? "✊ Closed Fist"
      : "☝️ Open / Adjusting";
  } else {
    gestureNameEl.textContent = "No hand detected";
  }

  canvasCtx.restore();
}

// --- Camera start ---
const camera = new Camera(videoElement, {
  onFrame: async () => { await hands.send({image: videoElement}); },
  width:  640,
  height: 480
});
camera.start();

// initialize UI to our defaults
audioEl.volume        = currentVolume;
volumeBarEl.value     = currentVolume * 100;
volumePctEl.textContent = `${Math.round(currentVolume*100)}%`;
muteStatusEl.textContent  = "Unmuted";
gestureNameEl.textContent = "Initializing Camera…";
