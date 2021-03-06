const { PythonShell } = require('python-shell');
const electron = require('electron');
const { ipcRenderer } = electron;
const path = require('path');


ipcRenderer.on('START_PROCESSING', (event, args) => {

    const { data } = args;
    let pyshell = new PythonShell(path.join(__dirname, '/../scripts/factorial.py'), {
        pythonPath: 'python',
        args: [data]
    });

    pyshell.on('message', function(results) {
        ipcRenderer.send('MESSAGE_FROM_BACKGROUND', { message: results });
    });
});

ipcRenderer.send('BACKGROUND_READY');