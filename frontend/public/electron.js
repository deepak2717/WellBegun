const electron = require('electron');
const path = require('path');
const url = require('url');

const { app } = electron;
const { BrowserWindow } = electron;

const { ipcMain } = require('electron');

let mainWindow;

function createWindow() {
	const startUrl = process.env.DEV
		? 'http://localhost:3000'
		: url.format({
			pathname: path.join(__dirname, '/../build/index.html'),
			protocol: 'file:',
			slashes: true,
		});
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
	});

	mainWindow.loadURL(startUrl);
	process.env.DEV && mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// ------------------- set up event listeners here --------------------

// temporary variable to store data while background
// process is ready to start processing
let cache = {
	data: undefined,
};

// a window object outside the function scope prevents
// the object from being garbage collected
let hiddenWindow;

// This event listener will listen for request
// from visible renderer process
ipcMain.on('START_BACKGROUND_VIA_MAIN', (event, args) => {
	const backgroundFileUrl = url.format({
		pathname: path.join(__dirname, `../background_tasks/background.html`),
		protocol: 'file:',
		slashes: true,
	});
	hiddenWindow = new BrowserWindow({
		show: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
	});
	console.log(backgroundFileUrl);
	hiddenWindow.loadURL(backgroundFileUrl);

	hiddenWindow.webContents.openDevTools();

	hiddenWindow.on('closed', () => {
		hiddenWindow = null;
	});

	cache.data = args.jsonfile;
	console.log(cache.data);
});

// This event listener will listen for data being sent back
// from the background renderer process
ipcMain.on('MESSAGE_FROM_BACKGROUND', (event, args) => {
	mainWindow.webContents.send('MESSAGE_FROM_BACKGROUND_VIA_MAIN', args.message);
});

ipcMain.on('BACKGROUND_READY', (event, args) => {

	event.reply('START_PROCESSING', {
		data: cache.data,
	});
});
