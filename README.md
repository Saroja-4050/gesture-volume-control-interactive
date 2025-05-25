# Gesture Volume Control 🖐️🔊

This project allows you to control audio playback using hand gestures through your webcam. Adjust volume, mute/unmute, and play/pause a sample audio track with intuitive hand movements. This application uses MediaPipe Hands for real-time hand tracking and gesture recognition.

## ✨ Features

* **Volume Control:** Pinch your thumb and index finger together to adjust the volume.
* **Mute/Unmute:** Make a closed fist to mute and an open palm to unmute.
* **Play/Pause:** Give a thumbs up to play and a thumbs down to pause the audio.
* **Real-time Visual Feedback:** See your webcam feed with hand landmarks overlaid, and get instant feedback on detected gestures and audio status.

## 🚀 How to Run

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Saroja-4050/gesture-volume-control-interactive.git](https://github.com/Saroja-4050/gesture-volume-control-interactive.git)
    cd gesture-volume-control-interactive
    ```

2.  **Open `index.html`:**
    Navigate to the project directory and open the `index.html` file in your web browser (e.g., Chrome, Firefox).

3.  **Allow Camera Access:**
    The browser will prompt you for permission to use your webcam. Please allow access for the gesture recognition to work.

4.  **Start Gesturing!**
    Once the camera is active, you should see your video feed. Use the gestures outlined below to control the audio.

##  Gestures

* **✊ Mute:** Closed Fist (one or fewer fingers extended)
* **🤚 Unmute:** Open Palm (three or more fingers extended)
* **🤏 Volume Control:** Pinch with your Thumb and Index finger.
    * Closer pinch = lower volume
    * Wider pinch = higher volume
* **👍 Play Audio:** Thumbs Up
* **👎 Pause Audio:** Thumbs Down

## 🛠️ Technologies Used

* **HTML5**
* **CSS3**
* **JavaScript**
* **MediaPipe Hands:** For hand tracking and gesture recognition.
    * `@mediapipe/camera_utils`
    * `@mediapipe/drawing_utils`
    * `@mediapipe/hands`
* **A blank favicon:** To suppress 404 errors in the console.

## 💡 Notes

* Ensure you have a working webcam connected to your device.
* Good lighting conditions will improve gesture recognition accuracy.
* The application is configured to detect a single hand.
* There's a debounce time of 1.5 seconds for play/pause actions to prevent rapid toggling.

## 🤝 Contributing

Feel free to fork this repository, make improvements, and submit pull requests!
