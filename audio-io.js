import { setRawAudioData, setCurrentSampleRate, setOriginalRawAudioData, setOriginalSampleRate, clearAudioData, getRawAudioData, getCurrentSampleRate } from './audio-state.js';

let audioContext = null;

export async function handleAudioFile(file) {
    if (!file) {
        console.log("No audio file selected or dropped.");
        return;
    }

    const dropZone = document.getElementById('dropZone');
    const spinner = document.getElementById('dropSpinner');
    // ensure UI shows uploading
    dropZone.classList.add('uploading');
    if (spinner) spinner.style.display = 'inline-block';

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const numSamples = channelData.length;
    
    setRawAudioData(Array.from(channelData).slice(0, numSamples));
    setOriginalRawAudioData([...getRawAudioData()]); // Store original data
    setCurrentSampleRate(audioBuffer.sampleRate);
    setOriginalSampleRate(audioBuffer.sampleRate);

    document.getElementById('currentRate').textContent = getCurrentSampleRate();
    clearAudioData(); // Clear existing conversions
    document.getElementById('output').value = '';
    // toast on successful load
    import('./utils.js').then(m => m.showToast('Audio file loaded.', 'success'));

    // briefly show complete flash and clear uploading UI
    dropZone.classList.remove('uploading');
    dropZone.classList.add('upload-complete');
    if (spinner) spinner.style.display = 'none';
    setTimeout(() => dropZone.classList.remove('upload-complete'), 800);
}

export function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}