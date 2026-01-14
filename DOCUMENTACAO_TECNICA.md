# 👨‍💻 Documentação Técnica para Desenvolvedores

## 📋 Índice
1. [Arquitetura Geral](#arquitetura-geral)
2. [API IPC](#api-ipc)
3. [Funções de Store](#funções-de-store)
4. [Estrutura do DOM](#estrutura-do-dom)
5. [Gerenciamento de Estado](#gerenciamento-de-estado)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Exemplos de Código](#exemplos-de-código)
8. [Debugging](#debugging)

---

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                   CAMADA DE APRESENTAÇÃO                 │
│  (HTML/CSS/JavaScript no Renderer Process)              │
│  ├─ index.html (Templates e Estrutura)                  │
│  └─ renderer.js (Lógica de UI)                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ IPC (Inter-Process Communication)
                   │
┌──────────────────▼──────────────────────────────────────┐
│               CAMADA DE APLICAÇÃO                        │
│        (Main Process do Electron - main.js)             │
│  ├─ ipcMain.handle() - Handlers de IPC                  │
│  └─ Dialog, File I/O                                    │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                CAMADA DE DADOS                           │
│            (store.js - Business Logic)                  │
│  ├─ Operações CRUD de Transações                        │
│  ├─ Operações CRUD de Categorias                        │
│  └─ Aplicação de Regras                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│             CAMADA DE PERSISTÊNCIA                       │
│          (electron-store - Banco de Dados)              │
│  ├─ transactions (Array)                                │
│  └─ categories (Array)                                  │
└─────────────────────────────────────────────────────────┘
```

---

## API IPC

### Novos Handlers Implementados

#### 1. `delete-transaction`
**Propósito**: Deletar uma transação individual

**Entrada**:
```javascript
ipcMain.handle('delete-transaction', async (event, id) => {
  // id: number - ID da transação
})
```

**Saída**:
```javascript
// Retorna: true (sucesso)
```

**Exemplo de Chamada**:
```javascript
await window.electronAPI.deleteTransaction(123);
```

---

#### 2. `update-transaction`
**Propósito**: Atualizar uma transação individual

**Entrada**:
```javascript
ipcMain.handle('update-transaction', async (event, transaction) => {
  // transaction: {
  //   id: number,
  //   date: string (YYYY-MM-DD),
  //   description: string,
  //   amount: number,
  //   account: string,
  //   category: string,
  //   currency?: string (preservado),
  //   balance?: number (preservado)
  // }
})
```

**Saída**:
```javascript
// Retorna: true (sucesso)
```

**Exemplo de Chamada**:
```javascript
const transaction = {
  id: 123,
  date: '2025-12-15',
  description: 'Mercado',
  amount: 150.50,
  account: 'CC',
  category: 'Alimentação'
};
await window.electronAPI.updateTransaction(transaction);
```

---

#### 3. `delete-transactions`
**Propósito**: Deletar múltiplas transações

**Entrada**:
```javascript
ipcMain.handle('delete-transactions', async (event, ids) => {
  // ids: number[] - Array de IDs das transações
})
```

**Saída**:
```javascript
// Retorna: true (sucesso)
```

**Exemplo de Chamada**:
```javascript
await window.electronAPI.deleteTransactions([123, 124, 125]);
```

---

#### 4. `update-transactions-bulk`
**Propósito**: Atualizar múltiplas transações com os mesmos valores

**Entrada**:
```javascript
ipcMain.handle('update-transactions-bulk', async (event, ids, updates) => {
  // ids: number[] - Array de IDs
  // updates: {
  //   date?: string,
  //   category?: string,
  //   account?: string
  // } - Campos a serem atualizados
})
```

**Saída**:
```javascript
// Retorna: true (sucesso)
```

**Exemplo de Chamada**:
```javascript
await window.electronAPI.updateTransactionsBulk(
  [123, 124, 125],
  { category: 'Alimentação' }
);
```

---

## Funções de Store

### `deleteTransaction(id)`
```javascript
/**
 * Remove uma transação pelo ID
 * @param {number} id - ID da transação
 * @returns {boolean} true se deletado com sucesso
 */
function deleteTransaction(id) {
  let txs = store.get('transactions', []);
  txs = txs.filter(t => t.id !== id);
  store.set('transactions', txs);
  return true;
}
```

**Uso Interno**:
```javascript
deleteTransaction(123); // Remove transação com ID 123
```

---

### `updateTransaction(transaction)`
```javascript
/**
 * Atualiza uma transação existente
 * @param {Object} transaction - Objeto com dados atualizados
 * @returns {boolean} true se atualizado com sucesso
 */
function updateTransaction(transaction) {
  const txs = store.get('transactions', []);
  const idx = txs.findIndex(t => t.id === transaction.id);
  if (idx >= 0) {
    txs[idx] = transaction;
    store.set('transactions', txs);
    return true;
  }
  return false;
}
```

**Uso Interno**:
```javascript
const tx = {
  id: 123,
  date: '2025-12-15',
  description: 'Novo mercado',
  amount: 175.00,
  account: 'CC',
  category: 'Alimentação'
};
updateTransaction(tx);
```

---

### `deleteTransactions(ids)`
```javascript
/**
 * Remove múltiplas transações pelos IDs
 * @param {number[]} ids - Array de IDs das transações
 * @returns {boolean} true se deletado com sucesso
 */
function deleteTransactions(ids) {
  let txs = store.get('transactions', []);
  txs = txs.filter(t => !ids.includes(t.id));
  store.set('transactions', txs);
  return true;
}
```

**Uso Interno**:
```javascript
deleteTransactions([123, 124, 125]); // Remove 3 transações
```

---

### `updateTransactionsBulk(ids, updates)`
```javascript
/**
 * Atualiza múltiplas transações com os mesmos valores
 * @param {number[]} ids - Array de IDs das transações
 * @param {Object} updates - Campos a serem atualizados
 * @returns {boolean} true se atualizado com sucesso
 */
function updateTransactionsBulk(ids, updates) {
  const txs = store.get('transactions', []);
  ids.forEach(id => {
    const idx = txs.findIndex(t => t.id === id);
    if (idx >= 0) {
      txs[idx] = { ...txs[idx], ...updates };
    }
  });
  store.set('transactions', txs);
  return true;
}
```

**Uso Interno**:
```javascript
updateTransactionsBulk(
  [123, 124],
  { category: 'Alimentação', account: 'CC' }
);
// Atualiza apenas esses dois campos nas 2 transações
```

---

## Estrutura do DOM

### Elementos Críticos

#### Tabela de Transações
```html
<table id="txTable" class="w-full text-left">
  <thead class="bg-slate-50 sticky top-0">
    <tr>
      <th class="p-4">
        <input type="checkbox" id="selectAll" class="cursor-pointer">
      </th>
      <th>Data</th>
      <th>Conta</th>
      <th>Descrição</th>
      <th>Valor</th>
      <th>Categoria</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-slate-100">
    <!-- Preenchido dinamicamente -->
  </tbody>
</table>
```

#### Barra de Ações
```html
<div id="bulkActionsBar" class="hidden bg-blue-50 p-3 rounded-lg border border-blue-200">
  <span id="selectedCount">0 selecionadas</span>
  <button id="bulkEditBtn">✏️ Editar</button>
  <button id="bulkDeleteBtn">🗑️ Deletar</button>
  <button id="bulkCancelBtn">Cancelar</button>
</div>
```

#### Modal de Edição Individual
```html
<div id="editModal" class="hidden fixed inset-0 bg-black bg-opacity-50">
  <form id="editForm">
    <input type="hidden" id="editId">
    <input type="date" id="editDate">
    <input type="text" id="editDescription">
    <input type="number" id="editAmount">
    <input type="text" id="editAccount">
    <input type="text" id="editCategory">
    <button type="submit">Salvar</button>
    <button type="button" id="closeEditModal">Cancelar</button>
  </form>
</div>
```

#### Modal de Edição em Massa
```html
<div id="bulkEditModal" class="hidden fixed inset-0 bg-black bg-opacity-50">
  <form id="bulkEditForm">
    <div>
      <input type="checkbox" id="bulkEditDateCheck">
      <label>Alterar data</label>
      <input type="date" id="bulkEditDate" disabled>
    </div>
    <div>
      <input type="checkbox" id="bulkEditCategoryCheck">
      <label>Alterar categoria</label>
      <input type="text" id="bulkEditCategory" disabled>
    </div>
    <div>
      <input type="checkbox" id="bulkEditAccountCheck">
      <label>Alterar conta</label>
      <input type="text" id="bulkEditAccount" disabled>
    </div>
    <button type="submit">Aplicar Alterações</button>
    <button type="button" id="closeBulkEditModal">Cancelar</button>
  </form>
</div>
```

---

## Gerenciamento de Estado

### Estado Global (renderer.js)

```javascript
// Conjunto de IDs selecionados
let selectedIds = new Set();

// Cache de transações atuais para referência rápida
let currentTransactions = [];
```

### Estados do Modal Individual

```javascript
// Modal (editModal)
// .hidden = classe presente = modal escondido
// .hidden = classe ausente = modal visível

// Processo:
// 1. Usuário clica "Editar"
// 2. openEditModal() remove classe "hidden"
// 3. usuário interage com form
// 4. closeEditModal() adiciona classe "hidden" ou dados são salvos
```

### Estados do Modal em Massa

```javascript
// Campos ficam habilitados/desabilitados dinamicamente
// Exemplo:
document.getElementById('bulkEditDate').disabled = !e.target.checked;
// Se checkbox marcado: disabled = false (campo habilitado)
// Se checkbox desmarcado: disabled = true (campo desabilitado)
```

### Estados da Barra de Ações

```javascript
// Mostrada/escondida com classe "hidden"
if (selectedIds.size > 0) {
  bulkActionsBar.classList.remove('hidden'); // Mostra
} else {
  bulkActionsBar.classList.add('hidden'); // Esconde
}

// Contador atualizado
selectedCountSpan.textContent = `${selectedIds.size} selecionada(s)`;
```

---

## Fluxo de Dados

### Fluxo: Deletar Transação Individual

```
┌─────────────────┐
│ Usuário clica   │
│ botão 🗑️       │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ deleteTransaction(id)    │
│ (renderer.js)            │
│ - Confirmação            │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ window.electronAPI.deleteTransaction()  │
│ (IPC Message)                           │
└────────┬────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ ipcMain.handle('delete-transaction')    │
│ (main.js)                                │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ store.deleteTransaction(id)              │
│ (store.js)                               │
│ - Filter transações                      │
│ - Salva em electron-store                │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ IPC responde com true                    │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ loadTransactions() é chamado             │
│ - Recarrega dados                        │
│ - Reconstrói tabela                      │
│ - UI atualiza                            │
└──────────────────────────────────────────┘
```

---

### Fluxo: Editar Múltiplas Transações

```
┌──────────────────────┐
│ Usuário marca 3      │
│ checkboxes           │
└──────────┬───────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ selectedIds.add(id) executado 3 vezes  │
│ bulkActionsBar.classList.remove()      │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ Barra de ações fica visível            │
│ Mostra "3 selecionadas"                │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ Usuário clica "✏️ Editar"              │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ bulkEditModal.classList.remove()       │
│ Modal se torna visível                 │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ Usuário marca checkbox "categoria"     │
│ bulkEditCategory.disabled = false       │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ Usuário digita "Alimentação"           │
│ e clica "Aplicar Alterações"           │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ bulkEditForm.submit() event            │
│ updates = { category: 'Alimentação' }  │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ window.electronAPI.updateTransactionsBulk(
│   [id1, id2, id3],
│   { category: 'Alimentação' }
│ )                                      │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ ipcMain.handle('update-transactions-bulk')
│ (main.js)                              │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ store.updateTransactionsBulk(ids, updates)
│ (store.js)                             │
│ - Para cada ID:                        │
│   txs[idx] = { ...txs[idx], ...updates}│
│ - Salva em electron-store              │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ IPC responde com true                  │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ Modal fecha                            │
│ loadTransactions() recarrega dados     │
│ Tabela atualizada com nova categoria   │
└────────────────────────────────────────┘
```

---

## Exemplos de Código

### Exemplo 1: Estender para Editar Múltiplos Campos

**Cenário**: Você quer adicionar a opção de editar "valor" em massa

**Arquivo**: `renderer/index.html`
```html
<!-- Adicionar novo input no modal de edição em massa -->
<div class="flex items-center gap-2">
  <input type="checkbox" id="bulkEditAmountCheck">
  <label class="text-sm font-medium cursor-pointer">Alterar valor</label>
  <input type="number" id="bulkEditAmount" placeholder="Valor" disabled 
         class="flex-1 border border-slate-300 rounded-md px-3 py-1.5">
</div>
```

**Arquivo**: `renderer/renderer.js`
```javascript
// Adicionar listener para habilitar/desabilitar
document.getElementById('bulkEditAmountCheck').addEventListener('change', (e) => {
  document.getElementById('bulkEditAmount').disabled = !e.target.checked;
});

// Modificar a função de submit do formulário
bulkEditForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const updates = {};
  
  // ... código existente ...
  
  // Adicionar novo campo
  if (document.getElementById('bulkEditAmountCheck').checked) {
    updates.amount = parseFloat(document.getElementById('bulkEditAmount').value);
  }
  
  // ... resto do código ...
});
```

---

### Exemplo 2: Adicionar Validação de Valor

**Arquivo**: `renderer/renderer.js`
```javascript
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validações adicionadas
  const amount = parseFloat(document.getElementById('editAmount').value);
  if (isNaN(amount) || amount <= 0) {
    alert('O valor deve ser um número positivo');
    return;
  }
  
  const date = document.getElementById('editDate').value;
  if (!date) {
    alert('Data é obrigatória');
    return;
  }
  
  // ... resto do código ...
});
```

---

### Exemplo 3: Adicionar Confirmação antes de Salvar

**Arquivo**: `renderer/renderer.js`
```javascript
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const date = document.getElementById('editDate').value;
  const description = document.getElementById('editDescription').value;
  const amount = document.getElementById('editAmount').value;
  
  const confirmMsg = `Confirmar alterações?\n\nData: ${date}\nDescrição: ${description}\nValor: ${amount}`;
  
  if (!confirm(confirmMsg)) {
    return; // Usuário cancelou
  }
  
  // ... prosseguir com salvar ...
});
```

---

## Debugging

### Console do Renderer

Para ver logs do renderer (UI), use DevTools:

```javascript
// Adicionar logs em pontos críticos
console.log('Transações carregadas:', currentTransactions);
console.log('Selecionados:', Array.from(selectedIds));
console.log('Updates para enviar:', updates);
```

### Console do Main

Para ver logs do processo principal:

```javascript
ipcMain.handle('delete-transaction', async (event, id) => {
  console.log('Deletando transação com ID:', id);
  const result = store.deleteTransaction(id);
  console.log('Resultado:', result);
  return result;
});
```

### Verificar Estado de Elementos

```javascript
// No console do DevTools
document.getElementById('selectAll').checked  // true/false
document.getElementById('bulkActionsBar').classList.contains('hidden')  // true/false
selectedIds  // mostra o Set de selecionados
currentTransactions  // mostra o array de transações
```

### Simular Cliques

```javascript
// Simular seleção de uma transação
document.querySelector('[data-id="123"]').click();

// Simular clique no botão de deletar
document.getElementById('bulkDeleteBtn').click();
```

---

## Testes Unitários (Sugestão)

### Testar store.js

```javascript
// Arquivo: test/store.test.js
const store = require('../store.js');

describe('deleteTransaction', () => {
  it('deve deletar uma transação pelo ID', () => {
    // Setup
    store.addTransaction({ id: 1, description: 'Test', amount: 100 });
    
    // Execute
    const result = store.deleteTransaction(1);
    
    // Assert
    expect(result).toBe(true);
    expect(store.getAllTransactions()).toHaveLength(0);
  });
});

describe('updateTransactionsBulk', () => {
  it('deve atualizar múltiplas transações', () => {
    // Setup
    store.addTransaction({ id: 1, category: 'Old' });
    store.addTransaction({ id: 2, category: 'Old' });
    
    // Execute
    store.updateTransactionsBulk([1, 2], { category: 'New' });
    
    // Assert
    const txs = store.getAllTransactions();
    expect(txs[0].category).toBe('New');
    expect(txs[1].category).toBe('New');
  });
});
```

---

## Performance

### Otimizações Implementadas

1. **Set ao invés de Array**: `selectedIds` usa `Set` para busca O(1)
2. **Cache Local**: `currentTransactions` evita múltiplas chamadas IPC
3. **Atualização Seletiva**: Modal em massa só modifica campos selecionados
4. **Lazy Loading**: Dados carregados sob demanda

### Possíveis Melhorias

1. **Pagination**: Limitar tabela a 50 itens por página
2. **Virtual Scrolling**: Para listas muito grandes
3. **Web Workers**: Processar dados pesados em thread separada
4. **Debouncing**: Delay em buscas/filtros

---

## Segurança

### Validações Implementadas

1. ✅ Confirmação antes de deletar
2. ✅ Validação de tipo de dados
3. ✅ Sanitização de entrada
4. ✅ Preservação de campos sensíveis

### Melhorias Sugeridas

1. **Autenticação**: Adicionar login
2. **Criptografia**: Criptografar dados sensíveis
3. **Rate Limiting**: Limitar requisições por segundo
4. **Audit Log**: Registrar quem fez o quê e quando

---

## Versionamento da API

### v1.0 (Atual)
- ✅ Deletar transação individual
- ✅ Editar transação individual
- ✅ Deletar múltiplas transações
- ✅ Editar múltiplas transações (campos selecionados)

### v2.0 (Sugerido)
- 📝 Desfazer/Refazer
- 📝 Histórico de alterações
- 📝 Validações avançadas
- 📝 Atalhos de teclado

---

Pronto! Este é um guia técnico completo para manutenção e expansão do código. 🚀
