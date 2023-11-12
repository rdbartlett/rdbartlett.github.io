export function updateButtonStatus(isRecording) {
    const recordButton = document.getElementById('recordButton');
    if (isRecording) {
        recordButton.textContent = 'Stop';
        recordButton.classList.add('recording');
    } else {
        recordButton.textContent = 'Record';
        recordButton.classList.remove('recording');
    }
}
