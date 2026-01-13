import { handleAudioFile } from './audio-io.js';
import { setCustomSampleRate, divideSampleRate, undoDivideSampleRate, divideVolume, undoDivideVolume, convertToSampleData } from './audio-processing.js';
import { convertToBytebeat } from './bytebeat-converter.js';
import { downloadBytebeat, copyBytebeat } from './utils.js';

export function setupEventListeners() {
    // Audio Drop Zone
    const dropZone = document.getElementById('dropZone');
    const audioFileInput = document.getElementById('audioFile');

    dropZone.addEventListener('click', () => audioFileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            // show uploading state immediately
            dropZone.classList.add('uploading');
            handleAudioFile(file);
        }
    });
    audioFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            dropZone.classList.add('uploading');
            handleAudioFile(e.target.files[0]);
        }
    });

    // Audio Control Buttons
    document.getElementById('convertToSampleData').addEventListener('click', convertToSampleData);
    document.getElementById('convertToBytebeat').addEventListener('click', convertToBytebeat);
    document.getElementById('downloadBytebeat').addEventListener('click', downloadBytebeat);
    document.getElementById('copyBytebeat').addEventListener('click', copyBytebeat);

    // Checkboxes
    document.getElementById('enableFloat').addEventListener('change', function() {
        const dangerText = document.getElementById('dangerText');
        if (!this.checked) {
            dangerText.style.display = 'block';
        } else {
            dangerText.style.display = 'none';
        }
    });

    // Sample Rate Controls
    document.getElementById('setCustomSampleRateBtn').addEventListener('click', setCustomSampleRate);
    document.getElementById('divideSampleRateBtn').addEventListener('click', divideSampleRate);
    document.getElementById('undoDivideSampleRateBtn').addEventListener('click', undoDivideSampleRate);

    // Volume Controls
    document.getElementById('divideVolumeBtn').addEventListener('click', divideVolume);
    document.getElementById('undoDivideVolumeBtn').addEventListener('click', undoDivideVolume);
}