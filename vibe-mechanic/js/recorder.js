import { updateButtonStatus } from './ui.js';
import { processRecording } from './audioProcessing.js'

export let mediaRecorder;
export let audioChunks = [];

export function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            updateButtonStatus(true);

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.start();
        })
        .catch(e => console.error(e));
}

export function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
        updateButtonStatus(false);
        processRecording(audioChunks);
    };
}
