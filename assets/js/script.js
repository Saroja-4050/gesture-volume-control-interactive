"use strict";

// — DOM REFS —
const videoElement   = document.getElementById("webcamInput");
const canvasElement  = document.getElementById("outputCanvas");
const canvasCtx      = canvasElement.getContext("2d");
const gestureNameEl  = document.getElementById("gestureName");
const volumeBarEl    = document.getElementById("volumeBar");
const volumePctEl    = document.getElementById("volumePercentage");
const muteStatusEl   = document.getElementById("muteStatus");
const audioEl        = document.getElementById("sampleAudio");

// — STATE & CONSTS —
let currentVolume     = 0.5;
let isMuted           = false;
let lastPlayPauseTime = 0;
const PLAY_DEBOUNCE   = 1500;   // ms
const PINCH_MIN       = 0.02;
const PINCH_MAX       = 0.25;
const FOLD_THRESH     = 0.05;   // relative y-distance

// — UTILS —
function getDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z||0) - (b.z||0));
}

// returns how many of the four fingers (idx→pinky) are extended
function countExtendedFingers(lm) {
  const tips = [8,12,16,20];
  const pips = [6,10,14,18];
  return tips.filter((tip,i) => {
    // tip above pip in y-axis = extended
    return lm[tip].y < lm[pips[i]].y - FOLD_THRESH;
  }).length;
}

// — MEDIAPIPE SETUP —
const hands = new Hands({
  locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
});
hands.setOptions({
  maxNumHands:            1,
  modelComplexity:        0,
  minDetectionConfidence: 0.7,
  minTrackingConfidence:  0.7
});
hands.onResults(onResults);

// — PER-FRAME CALLBACK —
function onResults(results) {
  // 1) resize canvas
  if (
    canvasElement.width  !== videoElement.videoWidth ||
    canvasElement.height !== videoElement.videoHeight
  ) {
    canvasElement.width  = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
  }

  // 2) mirror & draw camera
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.translate(canvasElement.width, 0);
  canvasCtx.scale(-1, 1);
  canvasCtx.drawImage(
    results.image, 0, 0,
    canvasElement.width, canvasElement.height
  );

  if (results.multiHandLandmarks?.length) {
    const lm = results.multiHandLandmarks[0];

    // draw overlay
    drawConnectors(canvasCtx, lm, HAND_CONNECTIONS, {
      color: "#61dafb", lineWidth: 4
    });
    drawLandmarks(canvasCtx, lm, {
      color: "#ffffff", lineWidth: 1, radius: 5
    });

    // — VOLUME (pinch thumb↔index) —
    const pinchDist = getDistance(lm[4], lm[8]);
    const normVol = Math.min(
      Math.max((pinchDist - PINCH_MIN) / (PINCH_MAX - PINCH_MIN), 0),
      1
    );
    currentVolume = normVol;
    audioEl.volume = currentVolume;
    volumeBarEl.value = currentVolume * 100;
    volumePctEl.textContent = `${Math.round(currentVolume*100)}%`;

    // — MUTE / UNMUTE (fist vs open palm) —
    const extCount = countExtendedFingers(lm);
    if (extCount <= 1 && !isMuted) {
      isMuted = true;
      audioEl.muted = true;
    } else if (extCount >= 3 && isMuted) {
      isMuted = false;
      audioEl.muted = false;
    }
    muteStatusEl.textContent = isMuted ? "Muted" : "Unmuted";

    // — PLAY / PAUSE (thumbs up/down) —
    const now = Date.now();
    const thumbTip = lm[4], thumbDip = lm[3];
    const thumbExtended = getDistance(thumbTip, thumbDip) > FOLD_THRESH;
    const thumbUp   = thumbExtended && (thumbTip.y < thumbDip.y - 0.02);
    const thumbDown = thumbExtended && (thumbTip.y > thumbDip.y + 0.02);

    if (
      thumbUp &&
      audioEl.paused &&
      now - lastPlayPauseTime > PLAY_DEBOUNCE
    ) {
      audioEl.play().catch(()=>{});
      lastPlayPauseTime = now;
    } else if (
      thumbDown &&
      !audioEl.paused &&
      now - lastPlayPauseTime > PLAY_DEBOUNCE
    ) {
      audioEl.pause();
      lastPlayPauseTime = now;
    }

    // — GESTURE LABEL —
    if (thumbUp) {
      gestureNameEl.textContent = "👍 Play";
    } else if (thumbDown) {
      gestureNameEl.textContent = "👎 Pause";
    } else if (isMuted) {
      gestureNameEl.textContent = "✊ Muted";
    } else if (extCount >= 3) {
      gestureNameEl.textContent = "🤚 Unmuted";
    } else {
      gestureNameEl.textContent = "🤏 Adjust Volume";
    }

  } else {
    gestureNameEl.textContent = "No hand detected";
  }

  canvasCtx.restore();
}

// — START CAMERA LOOP —
new Camera(videoElement, {
  onFrame: async () => await hands.send({image: videoElement}),
  width:  640,
  height: 480
}).start();

// — INITIAL UI —
audioEl.volume         = currentVolume;
volumeBarEl.value      = currentVolume * 100;
volumePctEl.textContent  = `${Math.round(currentVolume*100)}%`;
muteStatusEl.textContent = "Unmuted";
gestureNameEl.textContent = "Initializing Camera…";
