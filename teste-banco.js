// Em vez de 'import', usamos 'require'
const { createClient } = require("@libsql/client");

// --- CONFIGURAÇÃO ---
const DB_URL = "libsql://projetogastos-charlesjrszz.aws-ap-northeast-1.turso.io";

// ⚠️ IMPORTANTE: Cole seu token aqui
const DB_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njg0MzIwMzIsImlkIjoiMTdkMTNiNmEtYzYzOC00OGY4LWFmYmItYjJlNDdlZDFjZmU2IiwicmlkIjoiNWQyZDM4ZTQtMGY0MC00NTg4LWE0OTAtZDhiOGIzOWRlNTY5In0.qbXgOnrmX9eyANKKyZoHmkiNq4VhUAo-U6mMACcc7lwnj6ajTvTDWViCs7u7txDR_Zi3ZneOyUAE9d31B_1mBQ"; 

const client = createClient({
  url: DB_URL,
  authToken: DB_TOKEN,
});

async function main() {
  try {
    console.log("🔌 Conectando ao Turso...");

    // 1. Criar Tabela
    await client.execute(`
      CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        categoria TEXT,
        valor REAL NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabela verificada.");

    // 2. Inserir
    console.log("💸 Inserindo gasto...");
    await client.execute({
      sql: "INSERT INTO gastos (descricao, categoria, valor) VALUES (?, ?, ?)",
      args: ["Teclado Mecânico", "Periféricos", 250.00], 
    });

    // 3. Ler
    const result = await client.execute("SELECT * FROM gastos");
    
    console.log("\n📊 Seus Gastos:");
    for (const row of result.rows) {
        // Nota: No modo CommonJS/Electron, às vezes o row vem como array ou objeto.
        // Se row.descricao não funcionar, tente row[1]
        console.log(row); 
    }

  } catch (erro) {
    console.error("❌ Erro:", erro);
  }
}

main();