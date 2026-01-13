let rawAudioData = null;
let originalRawAudioData = null;
let currentSampleRate = 44100;
let originalSampleRate = 44100;
let audioDataString = '';

export function getRawAudioData() {
    return rawAudioData;
}

export function setRawAudioData(data) {
    rawAudioData = data;
}

export function getOriginalRawAudioData() {
    return originalRawAudioData;
}

export function setOriginalRawAudioData(data) {
    originalRawAudioData = data;
}

export function getCurrentSampleRate() {
    return currentSampleRate;
}

export function setCurrentSampleRate(rate) {
    currentSampleRate = rate;
}

export function getOriginalSampleRate() {
    return originalSampleRate;
}

export function setOriginalSampleRate(rate) {
    originalSampleRate = rate;
}

export function getAudioDataString() {
    return audioDataString;
}

export function setAudioDataString(data) {
    audioDataString = data;
}

export function clearAudioData() {
    audioDataString = '';
}

