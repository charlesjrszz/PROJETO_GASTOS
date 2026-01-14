const { createClient } = require("@libsql/client");

const DB_URL = "libsql://projetogastos-charlesjrszz.aws-ap-northeast-1.turso.io";
const DB_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njg0MzIwMzIsImlkIjoiMTdkMTNiNmEtYzYzOC00OGY4LWFmYmItYjJlNDdlZDFjZmU2IiwicmlkIjoiNWQyZDM4ZTQtMGY0MC00NTg4LWE0OTAtZDhiOGIzOWRlNTY5In0.qbXgOnrmX9eyANKKyZoHmkiNq4VhUAo-U6mMACcc7lwnj6ajTvTDWViCs7u7txDR_Zi3ZneOyUAE9d31B_1mBQ"; 


const client = createClient({ url: DB_URL, authToken: DB_TOKEN });

async function setup() {
  try {
    console.log("🔨 Criando tabela de histórico de arquivos...");
    
    // A coluna 'conteudo' será do tipo BLOB (onde o arquivo fica salvo)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS historico_arquivos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_arquivo TEXT NOT NULL,
        tipo_arquivo TEXT,
        conteudo BLOB, 
        data_upload DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabela criada com sucesso!");
  } catch (e) {
    console.error(e);
  }
}

setup();