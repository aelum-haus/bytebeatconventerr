import { getAudioDataString } from './audio-state.js';

// loadPyodide is expected to be a global function provided by the pyodide CDN script in index.html
const loadPyodide = window.loadPyodide; 
let pyodideReadyPromise;

export function initPyodide() {
    pyodideReadyPromise = loadPyodide().then((pyodide) => pyodide);
}

export async function convertToBytebeat() {
    const audioData = getAudioDataString();
    if (!audioData) {
        (await import('./utils.js')).showToast('Please convert to sample data first.', 'error');
        return;
    }
    
    const pyodide = await pyodideReadyPromise;
    const volume = document.getElementById('volume').value / 100;
    const enableFloat = document.getElementById('enableFloat').checked;
    const enableVolume = document.getElementById('enableVolume').checked;
    const format = document.querySelector('input[name="format"]:checked').value;
    
    try {
        const pythonCode = `
import io

input_data = """${audioData}"""
values = [float(line.strip()) for line in input_data.split('\\n') if line.strip()]

converted_values = [chr(int((value + 1) * 37 + 48)).replace('\\\\', '\\\\\\\\').replace('\\n', '\\\\n') for value in values]

result = "".join(converted_values)
result
        `;
        
        const result = pyodide.runPython(pythonCode);
        let bytebeatFormula;

        switch(format) {
            case 'default':
                if (!enableVolume || volume === 1) {
                    bytebeatFormula = enableFloat ? 
                        `sampledata="${result}",((sampledata[t%sampledata.length].charCodeAt(0)*3)-127)/128-1` :
                        `sampledata="${result}",(sampledata[t%sampledata.length].charCodeAt(0)*3)-127`;
                } else {
                    bytebeatFormula = enableFloat ?
                        `sampledata="${result}",${volume}*((sampledata[t%sampledata.length].charCodeAt(0)*3-127)/128-1)` :
                        `sampledata="${result}",${volume}*(sampledata[t%sampledata.length].charCodeAt(0)*3)-127`;
                }
                break;
                
            case 'alternate':
                // Corrected sampledata access in alternate format
                if (!enableVolume || volume === 1) {
                    bytebeatFormula = enableFloat ? 
                        `t||(sampledata="${result}"),((sampledata[t%sampledata.length].charCodeAt(0)*3)-127)/128-1` :
                        `t||(sampledata="${result}"),(sampledata[t%sampledata.length].charCodeAt(0)*3)-127`;
                } else {
                    bytebeatFormula = enableFloat ?
                        `t||(sampledata="${result}"),${volume}*((sampledata[t%sampledata.length].charCodeAt(0)*3-127)/128-1)` :
                        `t||(sampledata="${result}"),${volume}*(sampledata[t%sampledata.length].charCodeAt(0)*3-127)`;
                }
                break;
                
            case 'assignment':
                if (!enableVolume || volume === 1) {
                    bytebeatFormula = enableFloat ? 
                        `(sample_data="${result}",((sample_data[t%sample_data.length].charCodeAt(0)*3)-127)/128-1)` :
                        `(sample_data="${result}",(sample_data[t%sample_data.length].charCodeAt(0)*3)-127)`;
                } else {
                    bytebeatFormula = enableFloat ?
                        `(sample_data="${result}",${volume}*((sample_data[t%sample_data.length].charCodeAt(0)*3-127)/128-1))` :
                        `(sample_data="${result}",${volume}*(sample_data[t%sample_data.length].charCodeAt(0)*3-127))`;
                }
                break;
        }
        
        document.getElementById('output').value = bytebeatFormula;
        (await import('./utils.js')).showToast('Bytebeat generated.', 'success');
        
    } catch (error) {
        console.error('Conversion error:', error);
        document.getElementById('output').value = 'Error: ' + error;
    }
}