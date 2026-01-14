const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const { parseOFX } = require('./parsers/ofxParser');
const { parseSpreadsheet } = require('./parsers/xlsxParser');
const store = require('./store');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Financial files', extensions: ['ofx', 'qfx', 'xlsx', 'ods', 'csv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled) return [];

  const parsedAll = [];

  for (const filePath of result.filePaths) {
    const ext = path.extname(filePath).toLowerCase();
    const buffer = fs.readFileSync(filePath);

    try {
      let parsed = [];
      if (ext === '.ofx' || ext === '.qfx') {
        parsed = parseOFX(buffer.toString());
      } else if (ext === '.xlsx' || ext === '.ods' || ext === '.csv') {
        parsed = parseSpreadsheet(buffer, ext);
      } else {
        parsed = [];
      }

      // Save to local store
      parsed.forEach(tx => store.addTransaction(tx));

      parsedAll.push({ file: filePath, count: parsed.length });
    } catch (err) {
      console.error('Failed to parse', filePath, err);
    }
  }

  return { summary: parsedAll, all: store.getAllTransactions() };
});

ipcMain.handle('get-transactions', async () => {
  return store.getAllTransactions();
});

ipcMain.handle('get-categories', async () => {
  return store.getCategories();
});

ipcMain.handle('add-category', async (event, cat) => {
  return store.addCategory(cat);
});

ipcMain.handle('update-category', async (event, cat) => {
  return store.updateCategory(cat);
});

ipcMain.handle('delete-category', async (event, id) => {
  return store.deleteCategory(id);
});

ipcMain.handle('add-rule', async (event, catId, pattern) => {
  return store.addRuleToCategory(catId, pattern);
});

ipcMain.handle('delete-rule', async (event, catId, ruleId) => {
  return store.deleteRuleFromCategory(catId, ruleId);
});

ipcMain.handle('export-csv', async () => {
  const all = store.getAllTransactions();
  const csv = [
    'date,account,description,amount,currency,category'
  ].concat(all.map(t => `${t.date},"${t.account}","${t.description}",${t.amount},${t.currency || ''},"${t.category || ''}"`)).join('\n');

  const { filePath } = await dialog.showSaveDialog({
    defaultPath: 'transactions.csv'
  });

  if (!filePath) return { saved: false };

  fs.writeFileSync(filePath, csv);
  return { saved: true, file: filePath };
});
