import { getRawAudioData, setRawAudioData, getCurrentSampleRate, setCurrentSampleRate, getOriginalRawAudioData, getOriginalSampleRate, setAudioDataString, clearAudioData } from './audio-state.js';

export function setCustomSampleRate() {
    const rawAudioData = getRawAudioData();
    if (!rawAudioData) {
        (async () => (await import('./utils.js')).showToast('Please load audio file first.', 'error'))();
        return;
    }
    
    const newRate = parseInt(document.getElementById('customSampleRate').value);
    if (newRate < 1 || isNaN(newRate)) {
        alert('Please enter a valid sample rate greater than 0');
        return;
    }
    
    const ratio = getCurrentSampleRate() / newRate;
    
    const newData = [];
    for (let i = 0; i < rawAudioData.length; i += ratio) {
        const index = Math.floor(i);
        const fraction = i - index;
        
        if (index + 1 < rawAudioData.length) {
            const sample = rawAudioData[index] * (1 - fraction) + 
                          rawAudioData[index + 1] * fraction;
            newData.push(sample);
        } else {
            newData.push(rawAudioData[index]);
        }
    }
    
    setRawAudioData(newData);
    setCurrentSampleRate(newRate);
    document.getElementById('currentRate').textContent = getCurrentSampleRate();
    
    clearAudioData();
    (async () => (await import('./utils.js')).showToast('Sample rate adjusted. Convert to sample data again.', 'success'))();
}

export function divideSampleRate() {
    const rawAudioData = getRawAudioData();
    if (!rawAudioData) {
        (async () => (await import('./utils.js')).showToast('Please load audio file first.', 'error'))();
        return;
    }
    
    const divider = parseInt(document.getElementById('sampleRateDivider').value) || 1;
    if (divider < 1) return;
    
    const newData = [];
    for (let i = 0; i < rawAudioData.length; i += divider) {
        newData.push(rawAudioData[i]);
    }
    
    setRawAudioData(newData);
    setCurrentSampleRate(Math.floor(getCurrentSampleRate() / divider));
    document.getElementById('currentRate').textContent = getCurrentSampleRate();
    
    clearAudioData();
    (async () => (await import('./utils.js')).showToast('Sample rate divided. Convert to sample data again.', 'success'))();
}

export function undoDivideSampleRate() {
    const originalRawAudioData = getOriginalRawAudioData();
    if (!originalRawAudioData) {
        (async () => (await import('./utils.js')).showToast('No original audio data available.', 'error'))();
        return;
    }
    
    setRawAudioData([...originalRawAudioData]);
    setCurrentSampleRate(getOriginalSampleRate());
    document.getElementById('currentRate').textContent = getCurrentSampleRate();
    document.getElementById('sampleRateDivider').value = 1;
    document.getElementById('customSampleRate').value = getCurrentSampleRate(); 
    
    clearAudioData();
    (async () => (await import('./utils.js')).showToast('Sample rate restored. Convert to sample data again.', 'success'))();
}

export function divideVolume() {
    const rawAudioData = getRawAudioData();
    if (!rawAudioData) {
        (async () => (await import('./utils.js')).showToast('Please load audio file first.', 'error'))();
        return;
    }
    
    const divider = parseInt(document.getElementById('volumeDividerValue').value) || 1;
    if (divider < 1) return;
    
    setRawAudioData(rawAudioData.map(sample => sample / divider));
    
    clearAudioData();
    (async () => (await import('./utils.js')).showToast('Volume divided. Convert to sample data again.', 'success'))();
}

export function undoDivideVolume() {
    const originalRawAudioData = getOriginalRawAudioData();
    if (!originalRawAudioData) {
        (async () => (await import('./utils.js')).showToast('No original audio data available.', 'error'))();
        return;
    }
    
    setRawAudioData([...originalRawAudioData]);
    document.getElementById('volumeDividerValue').value = 1;
    
    clearAudioData();
    (async () => (await import('./utils.js')).showToast('Volume restored. Convert to sample data again.', 'success'))();
}

export function convertToSampleData() {
    const rawAudioData = getRawAudioData();
    if (!rawAudioData) {
        (async () => (await import('./utils.js')).showToast('Please load audio file first.', 'error'))();
        return;
    }
    const volume = document.getElementById('volume').value / 100;
    const processedData = rawAudioData.map(sample => (((sample * volume * 128) + 128)) / 128 - 1);
    setAudioDataString(processedData.map(sample => sample.toFixed(5)).join('\n'));
    (async () => (await import('./utils.js')).showToast('Sample data converted.', 'success'))();
}