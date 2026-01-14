const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  getTransactions: () => ipcRenderer.invoke('get-transactions'),
  exportCSV: () => ipcRenderer.invoke('export-csv'),
  getCategories: () => ipcRenderer.invoke('get-categories'),
  addCategory: (cat) => ipcRenderer.invoke('add-category', cat),
  updateCategory: (cat) => ipcRenderer.invoke('update-category', cat),
  deleteCategory: (id) => ipcRenderer.invoke('delete-category', id),
  addRule: (catId, pattern) => ipcRenderer.invoke('add-rule', catId, pattern),
  deleteRule: (catId, ruleId) => ipcRenderer.invoke('delete-rule', catId, ruleId)
});
