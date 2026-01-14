const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// --- TURSO INTEGRATION: Importar Cliente ---
const { createClient } = require("@libsql/client");

const { parseOFX } = require('./parsers/ofxParser');
const { parseSpreadsheet } = require('./parsers/xlsxParser');
const store = require('./store');

// --- TURSO INTEGRATION: Configuração ---
// ⚠️ IMPORTANTE: Coloque seu Token aqui
const client = createClient({
  url: "libsql://projetogastos-charlesjrszz.aws-ap-northeast-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njg0MzIwMzIsImlkIjoiMTdkMTNiNmEtYzYzOC00OGY4LWFmYmItYjJlNDdlZDFjZmU2IiwicmlkIjoiNWQyZDM4ZTQtMGY0MC00NTg4LWE0OTAtZDhiOGIzOWRlNTY5In0.qbXgOnrmX9eyANKKyZoHmkiNq4VhUAo-U6mMACcc7lwnj6ajTvTDWViCs7u7txDR_Zi3ZneOyUAE9d31B_1mBQ" 
});

// Função para garantir que a tabela existe na nuvem
async function setupDatabase() {
  try {
    console.log("📡 Verificando conexão com Turso...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS historico_arquivos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_arquivo TEXT NOT NULL,
        tipo_arquivo TEXT,
        conteudo BLOB,
        data_upload DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Conectado ao Turso e tabela verificada.");
  } catch (err) {
    console.error("❌ Erro ao conectar no Turso:", err);
  }
}

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

app.whenReady().then(async () => {
  // Inicializa o banco antes de criar a janela
  await setupDatabase();
  
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
    const buffer = fs.readFileSync(filePath); // Lê o arquivo como Buffer (Binário)

    // --- TURSO INTEGRATION: Salvar Cópia na Nuvem ---
    try {
      console.log(`☁️ Enviando ${path.basename(filePath)} para o Turso...`);
      await client.execute({
        sql: "INSERT INTO historico_arquivos (nome_arquivo, tipo_arquivo, conteudo) VALUES (?, ?, ?)",
        args: [path.basename(filePath), ext, buffer] // buffer vai como BLOB
      });
      console.log("✅ Arquivo salvo na nuvem!");
    } catch (dbErr) {
      console.error("⚠️ Falha ao salvar no Turso (mas o app vai continuar):", dbErr);
    }
    // ------------------------------------------------

    try {
      let parsed = [];
      // Se for OFX, precisamos converter o buffer para string
      if (ext === '.ofx' || ext === '.qfx') {
        parsed = parseOFX(buffer.toString());
      } else if (ext === '.xlsx' || ext === '.ods' || ext === '.csv') {
        parsed = parseSpreadsheet(buffer, ext);
      } else {
        parsed = [];
      }

      // Save to local store (Seu código original)
      parsed.forEach(tx => store.addTransaction(tx));

      parsedAll.push({ file: filePath, count: parsed.length });
    } catch (err) {
      console.error('Failed to parse', filePath, err);
    }
  }

  return { summary: parsedAll, all: store.getAllTransactions() };
});

// --- TURSO INTEGRATION: Novo Handler para listar histórico ---
ipcMain.handle('get-file-history', async () => {
  try {
    // Trazemos apenas ID, Nome e Data para não pesar a internet baixando o conteúdo todo
    const res = await client.execute("SELECT id, nome_arquivo, tipo_arquivo, data_upload FROM historico_arquivos ORDER BY data_upload DESC");
    return res.rows;
  } catch (err) {
    console.error("Erro ao buscar histórico:", err);
    return [];
  }
});

// --- TURSO INTEGRATION: Novo Handler para baixar um arquivo antigo ---
ipcMain.handle('download-file-from-db', async (event, id) => {
    try {
        const res = await client.execute({
            sql: "SELECT nome_arquivo, conteudo FROM historico_arquivos WHERE id = ?",
            args: [id]
        });
        
        if (res.rows.length > 0) {
            const file = res.rows[0];
            // Pergunta onde salvar
            const { filePath } = await dialog.showSaveDialog({
                defaultPath: file.nome_arquivo || file[0] // Dependendo da versão do driver pode vir como array ou obj
            });

            if (filePath) {
                // Escreve o BLOB no disco
                // Nota: O Turso retorna o BLOB como Uint8Array ou Buffer
                fs.writeFileSync(filePath, Buffer.from(file.conteudo || file[1]));
                return { success: true };
            }
        }
        return { success: false };
    } catch (err) {
        console.error(err);
        return { success: false, error: err.message };
    }
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

// Delete individual transaction
ipcMain.handle('delete-transaction', async (event, id) => {
  return store.deleteTransaction(id);
});

// Update transaction
ipcMain.handle('update-transaction', async (event, transaction) => {
  return store.updateTransaction(transaction);
});

// Delete multiple transactions
ipcMain.handle('delete-transactions', async (event, ids) => {
  return store.deleteTransactions(ids);
});

// Update multiple transactions
ipcMain.handle('update-transactions-bulk', async (event, ids, updates) => {
  return store.updateTransactionsBulk(ids, updates);
});