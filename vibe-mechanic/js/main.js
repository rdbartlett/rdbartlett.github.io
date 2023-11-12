import { mediaRecorder, startRecording, stopRecording } from './recorder.js';
import { updateButtonStatus } from './ui.js';
// import { processRecording } from './audioProcessing.js'; // If needed here


document.getElementById('recordButton').addEventListener('click', () => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        startRecording();
    } else {
        stopRecording();
    }
});
