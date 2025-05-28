# Gesture Volume Control

This project allows you to control audio playback using hand gestures through your webcam. Adjust volume, mute/unmute, and play/pause a sample audio track with intuitive hand movements. This application uses MediaPipe Hands for real-time hand tracking and gesture recognition.

## Live Demo

[View the app live](https://saroja-4050.github.io/gesture-volume-control-interactive/)

## Features

- **Volume Control:** Pinch your thumb and index finger together to adjust the volume.  
- **Mute/Unmute:** Make a closed fist to mute and an open palm to unmute.  
- **Play/Pause:** Give a thumbs up to play and a thumbs down to pause the audio.  
- **Real-time Visual Feedback:** See your webcam feed with hand landmarks overlaid and get instant feedback on detected gestures and audio status.  

## How to Run

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Saroja-4050/gesture-volume-control-interactive.git
    cd gesture-volume-control-interactive
    ```
2. **Open `index.html`:** Navigate to the project directory and open the `index.html` file in your web browser (e.g., Chrome, Firefox).  
3. **Allow Camera Access:** Grant permission for your webcam when prompted.  
4. **Start Gesturing:** Once the camera is active, use the gestures outlined below to control the audio.  

## Gestures

- **Mute:** Closed Fist (one or fewer fingers extended)  
- **Unmute:** Open Palm (three or more fingers extended)  
- **Volume Control:** Pinch with your Thumb and Index finger.  
  - Closer pinch = lower volume  
  - Wider pinch = higher volume  
- **Play Audio:** Thumbs Up  
- **Pause Audio:** Thumbs Down  

## Technologies Used

- HTML5  
- CSS3  
- JavaScript  
- MediaPipe Hands  
  - `@mediapipe/camera_utils`  
  - `@mediapipe/drawing_utils`  
  - `@mediapipe/hands`  
- A blank favicon to suppress console 404 errors  

## Notes

- Ensure you have a working webcam connected.  
- Good lighting improves recognition accuracy.  
- The application detects only one hand.  
- There is a 1.5‑second debounce on play/pause to prevent rapid toggling.  

## Contributing

Feel free to fork this repository, make improvements, and submit pull requests!

## License

© 2025 Saroja Vuluvabeeti. All rights reserved.
