const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // --- Funções Originais ---
  selectFiles: () => ipcRenderer.invoke('select-files'),
  getTransactions: () => ipcRenderer.invoke('get-transactions'),
  exportCSV: () => ipcRenderer.invoke('export-csv'),
  getCategories: () => ipcRenderer.invoke('get-categories'),
  addCategory: (cat) => ipcRenderer.invoke('add-category', cat),
  updateCategory: (cat) => ipcRenderer.invoke('update-category', cat),
  deleteCategory: (id) => ipcRenderer.invoke('delete-category', id),
  addRule: (catId, pattern) => ipcRenderer.invoke('add-rule', catId, pattern),
  deleteRule: (catId, ruleId) => ipcRenderer.invoke('delete-rule', catId, ruleId),

  // --- NOVAS: Integração com Turso (Histórico de Arquivos) ---
  getFileHistory: () => ipcRenderer.invoke('get-file-history'),
  downloadFileFromDb: (id) => ipcRenderer.invoke('download-file-from-db', id),

  // --- NOVAS: Edição de Transações (Compatível com o main.js novo) ---
  deleteTransaction: (id) => ipcRenderer.invoke('delete-transaction', id),
  updateTransaction: (transaction) => ipcRenderer.invoke('update-transaction', transaction),
  deleteTransactions: (ids) => ipcRenderer.invoke('delete-transactions', ids),
  updateTransactionsBulk: (ids, updates) => ipcRenderer.invoke('update-transactions-bulk', ids, updates)
});