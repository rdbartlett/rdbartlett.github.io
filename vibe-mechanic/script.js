let mediaRecorder;
let audioChunks = [];

document.getElementById('recordButton').addEventListener('click', () => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        startRecording();
    } else {
        stopRecording();
    }
});

function startRecording() {
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

function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
        updateButtonStatus(false);
        processRecording();
    };
}

function updateButtonStatus(isRecording) {
    const recordButton = document.getElementById('recordButton');
    if (isRecording) {
        recordButton.textContent = 'Stop';
        recordButton.classList.add('recording');
    } else {
        recordButton.textContent = 'Record';
        recordButton.classList.remove('recording');
    }
}

function processRecording() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    const audioPlayer = document.getElementById('audioPlayback');
    audioPlayer.src = audioUrl;
    
    const audioContext = new AudioContext();

    const reader = new FileReader();
    reader.readAsArrayBuffer(audioBlob);
    reader.onloadend = () => {
        const arrayBuffer = reader.result;
        audioContext.decodeAudioData(arrayBuffer)
            .then(audioBuffer => {
                drawWaveform(audioBuffer);
            })
            .catch(e => console.error('Error decoding audio data:', e));
    };
}


function drawWaveform(audioBuffer) {
    const canvas = document.getElementById('waveformCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Unable to get canvas context!');
        return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const channelData = audioBuffer.getChannelData(0); // Assuming mono audio

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;

    const amplificationFactor = 3; // Increase this to amplify the waveform

    for (let i = 0; i < width; i++) {
        const dataIndex = Math.floor(i * channelData.length / width);
        const x = i;
        // Amplify the y value here
        const y = (1 - channelData[dataIndex] * amplificationFactor) * height / 2; 
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}
