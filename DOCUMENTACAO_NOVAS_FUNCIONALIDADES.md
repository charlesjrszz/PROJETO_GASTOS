# 📚 Documentação das Novas Funcionalidades

## Funcionalidades Implementadas

Este documento detalha as três novas funcionalidades adicionadas ao aplicativo **Fin Organizer**:

---

## 1. ❌ Deletar Despesa Individual

### Descrição
Permite deletar uma única despesa/transação de forma rápida e segura.

### Como Usar
1. Na tabela de transações, localize a linha da despesa que deseja deletar
2. Clique no botão **🗑️ Deletar** na coluna "Ações"
3. Confirme a exclusão na janela de confirmação
4. A despesa será removida imediatamente

### Detalhes Técnicos
- **Arquivo Backend**: `store.js` - Função `deleteTransaction(id)`
- **Arquivo Frontend**: `renderer.js` - Função `deleteTransaction(id)`
- **IPC Handler**: `delete-transaction` em `main.js`
- **Validação**: Inclui confirmação antes de deletar

### Exemplo de Código
```javascript
// Backend
function deleteTransaction(id) {
  let txs = store.get('transactions', []);
  txs = txs.filter(t => t.id !== id);
  store.set('transactions', txs);
  return true;
}

// Frontend
async function deleteTransaction(id) {
  if (!confirm('Tem certeza que deseja deletar esta transação?')) return;
  await window.electronAPI.deleteTransaction(id);
  await loadTransactions();
}
```

---

## 2. ✏️ Editar Dados de Despesa

### Descrição
Permite editar todos os campos de uma transação individual em um modal intuitivo.

### Como Usar
1. Na tabela de transações, clique no botão **✏️ Editar** da despesa desejada
2. A janela modal "Editar Transação" será aberta
3. Modifique os campos desejados:
   - **Data**: Alterar a data da transação
   - **Descrição**: Editar o descritivo da despesa
   - **Valor**: Ajustar o montante
   - **Conta**: Modificar a conta origem
   - **Categoria**: Alterar ou atribuir categoria
4. Clique em **Salvar** para confirmar as alterações
5. Clique em **Cancelar** para descartar as mudanças

### Campos Editáveis
| Campo | Tipo | Obrigatório |
|-------|------|------------|
| Data | Date Input | ✅ |
| Descrição | Texto | ✅ |
| Valor | Número (decimal) | ✅ |
| Conta | Texto | ❌ |
| Categoria | Texto | ❌ |

### Detalhes Técnicos
- **Arquivo Backend**: `store.js` - Função `updateTransaction(transaction)`
- **Arquivo Frontend**: `renderer.js` - Funções `openEditModal()` e `editForm.addEventListener()`
- **IPC Handler**: `update-transaction` em `main.js`
- **Modal ID**: `editModal` em `index.html`
- **Preservação de Dados**: Mantém automaticamente campos como `currency` e `balance`

### Exemplo de Código
```javascript
// Modal de Edição
function openEditModal(transaction) {
  document.getElementById('editId').value = transaction.id;
  document.getElementById('editDate').value = transaction.date;
  document.getElementById('editDescription').value = transaction.description;
  document.getElementById('editAmount').value = transaction.amount;
  // ... mais campos
  editModal.classList.remove('hidden');
}

// Salvar Alterações
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const transaction = {
    id: Number(document.getElementById('editId').value),
    date: document.getElementById('editDate').value,
    description: document.getElementById('editDescription').value,
    amount: parseFloat(document.getElementById('editAmount').value),
    // ... mais campos
  };
  await window.electronAPI.updateTransaction(transaction);
  editModal.classList.add('hidden');
  await loadTransactions();
});
```

---

## 3. ☑️ Seleção Múltipla e Alterações em Massa

### Descrição
Permite selecionar múltiplas despesas via checkboxes e realizar operações em lote como edição e deleção simultânea.

### Como Usar

#### Seleção de Despesas
1. **Selecionar Individual**: Clique no checkbox à esquerda de cada linha para selecionar
2. **Selecionar Todas**: Clique no checkbox do cabeçalho para selecionar/desselecionar todas
3. A barra de ações **"X selecionadas"** aparecerá automaticamente

#### Edição em Massa
1. Com uma ou mais despesas selecionadas, clique em **✏️ Editar**
2. A janela "Editar em Massa" será aberta
3. Marque os checkboxes dos campos que deseja alterar:
   - **Alterar data**: Aplica a mesma data a todas as selecionadas
   - **Alterar categoria**: Aplica a mesma categoria a todas
   - **Alterar conta**: Aplica a mesma conta a todas
4. Insira os novos valores nos campos habilitados
5. Clique em **Aplicar Alterações** para confirmar
6. Todos os registros selecionados serão atualizados simultaneamente

#### Deleção em Massa
1. Com uma ou mais despesas selecionadas, clique em **🗑️ Deletar**
2. Confirme a exclusão de múltiplos registros
3. Todas as transações selecionadas serão deletadas

#### Cancelar Seleção
1. Clique em **Cancelar** para limpar todas as seleções
2. A barra de ações desaparecerá

### Estados Visuais

#### Barra de Ações (Seleções Ativas)
```
┌─────────────────────────────────────────────┐
│ ☑ 3 selecionadas   [✏️ Editar] [🗑️ Deletar] [Cancelar] │
└─────────────────────────────────────────────┘
```

#### Tabela com Checkboxes
```
┌───┬─────────┬────────┬────────────┬─────────┬──────────┬──────────┐
│ ☐ │ Data    │ Conta  │ Descrição  │ Valor   │ Categoria│ Ações    │
├───┼─────────┼────────┼────────────┼─────────┼──────────┼──────────┤
│ ☑ │ 01/12   │ CC     │ Mercado    │ -150.00 │ Alimento │ ✏️ 🗑️   │
│ ☑ │ 02/12   │ CC     │ Gasolina   │ -80.00  │ Auto     │ ✏️ 🗑️   │
│ ☐ │ 03/12   │ CC     │ Cinema     │ -50.00  │ Lazer    │ ✏️ 🗑️   │
└───┴─────────┴────────┴────────────┴─────────┴──────────┴──────────┘
```

### Detalhes Técnicos

#### Backend - `store.js`
```javascript
// Deleção em massa
function deleteTransactions(ids) {
  let txs = store.get('transactions', []);
  txs = txs.filter(t => !ids.includes(t.id));
  store.set('transactions', txs);
  return true;
}

// Edição em massa
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

#### Frontend - `renderer.js`
```javascript
// Gerenciar seleções
let selectedIds = new Set();

selectAllCheckbox.addEventListener('change', () => {
  document.querySelectorAll('.tx-checkbox').forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
    const id = Number(checkbox.dataset.id);
    if (selectAllCheckbox.checked) {
      selectedIds.add(id);
    } else {
      selectedIds.delete(id);
    }
  });
  updateBulkActionsBar();
});

// Deleção em massa
bulkDeleteBtn.addEventListener('click', async () => {
  if (!confirm(`Tem certeza que deseja deletar ${selectedIds.size} transação(ões)?`)) return;
  await window.electronAPI.deleteTransactions(Array.from(selectedIds));
  await loadTransactions();
});

// Edição em massa
bulkEditForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const updates = {};
  
  if (document.getElementById('bulkEditDateCheck').checked) {
    updates.date = document.getElementById('bulkEditDate').value;
  }
  if (document.getElementById('bulkEditCategoryCheck').checked) {
    updates.category = document.getElementById('bulkEditCategory').value;
  }
  if (document.getElementById('bulkEditAccountCheck').checked) {
    updates.account = document.getElementById('bulkEditAccount').value;
  }

  await window.electronAPI.updateTransactionsBulk(Array.from(selectedIds), updates);
  await loadTransactions();
});
```

#### Frontend - `index.html`
```html
<!-- Checkbox para seleção individual -->
<input type="checkbox" class="tx-checkbox cursor-pointer" data-id="1">

<!-- Checkbox para selecionar todos -->
<input type="checkbox" id="selectAll" class="cursor-pointer">

<!-- Barra de ações -->
<div id="bulkActionsBar" class="hidden bg-blue-50 p-3 rounded-lg border border-blue-200">
  <span id="selectedCount">0 selecionadas</span>
  <button id="bulkEditBtn">✏️ Editar</button>
  <button id="bulkDeleteBtn">🗑️ Deletar</button>
  <button id="bulkCancelBtn">Cancelar</button>
</div>

<!-- Modal de edição em massa -->
<div id="bulkEditModal" class="hidden fixed inset-0 bg-black bg-opacity-50">
  <!-- Campos com checkboxes para habilitar edição seletiva -->
</div>
```

---

## 4. 📋 Fluxo de Dados

```
┌─────────────────────────────────────────────────────┐
│            Interface do Usuário (HTML)              │
├─────────────────────────────────────────────────────┤
│ • Tabela com Checkboxes                             │
│ • Botões de Ação (Editar/Deletar)                  │
│ • Modais de Edição (Individual/Massa)              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│     Lógica do Aplicativo (renderer.js)              │
├─────────────────────────────────────────────────────┤
│ • Gerenciar Seleções (selectedIds Set)             │
│ • Validações                                        │
│ • Confirmações do Usuário                          │
│ • Chamadas IPC para Backend                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│    Gerenciador de IPC (main.js)                     │
├─────────────────────────────────────────────────────┤
│ • delete-transaction                               │
│ • update-transaction                               │
│ • delete-transactions                              │
│ • update-transactions-bulk                         │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│    Camada de Dados (store.js)                       │
├─────────────────────────────────────────────────────┤
│ • deleteTransaction(id)                            │
│ • updateTransaction(transaction)                   │
│ • deleteTransactions(ids)                          │
│ • updateTransactionsBulk(ids, updates)             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│     Armazenamento (electron-store)                  │
└─────────────────────────────────────────────────────┘
```

---

## 5. 🎨 Interface e Estilo

### Cores e Componentes
- **Botões de Edição**: Azul (`bg-blue-600`)
- **Botões de Deleção**: Vermelho (`bg-red-600`)
- **Barra de Ações**: Fundo azul claro (`bg-blue-50`)
- **Modais**: Overlay escuro com fundo branco
- **Feedback**: Confirmações antes de ações destrutivas

### Acessibilidade
- ✅ Campos com labels descritivos
- ✅ Validação de entrada
- ✅ Confirmações antes de deletar
- ✅ Feedback visual claro de seleções

---

## 6. 🔒 Segurança e Validações

### Validações Implementadas
1. **Confirmação antes de deletar**: Evita exclusões acidentais
2. **Validação de campos obrigatórios**: Garante integridade dos dados
3. **Preservação de campos não editáveis**: Mantém informações críticas
4. **Tipo de dados apropriado**: Valores numéricos e datas validadas

### Exemplo de Validação
```javascript
if (!confirm(`Tem certeza que deseja deletar ${selectedIds.size} transação(ões)?`)) {
  return; // Aborta operação se usuário cancelar
}
```

---

## 7. 📱 Responsividade

As novas funcionalidades são totalmente responsivas e funcionam em:
- ✅ Desktop (telas grandes)
- ✅ Tablets (telas médias)
- ✅ Dispositivos com tela pequena

---

## 8. 🚀 Próximas Melhorias Sugeridas

1. **Desfazer/Refazer** (Undo/Redo)
2. **Histórico de Alterações** - Log das mudanças realizadas
3. **Exportar Seleção** - Exportar apenas as transações selecionadas
4. **Templates de Edição** - Salvar padrões de edição frequentes
5. **Busca Avançada** - Filtros mais sofisticados

---

## 9. 📝 Resumo das Alterações por Arquivo

### `main.js`
- ✅ Adicionados 4 novos handlers IPC

### `store.js`
- ✅ Adicionadas 4 novas funções
- ✅ Atualizadas exports

### `renderer/index.html`
- ✅ Adicionada coluna de checkbox na tabela
- ✅ Adicionada coluna de ações
- ✅ Adicionada barra de ações em massa
- ✅ Adicionado modal de edição individual
- ✅ Adicionado modal de edição em massa

### `renderer/renderer.js`
- ✅ Reescrita função `loadTransactions()`
- ✅ Adicionadas funções de seleção múltipla
- ✅ Adicionadas funções de edição individual
- ✅ Adicionadas funções de edição em massa
- ✅ Adicionadas funções de deleção

---

## 10. 🎯 Testes Recomendados

### Teste 1: Deleção Individual
- [ ] Deletar uma transação
- [ ] Confirmar exclusão
- [ ] Verificar se foi removida da tabela
- [ ] Cancelar exclusão e verificar se persiste

### Teste 2: Edição Individual
- [ ] Abrir modal de edição
- [ ] Modificar cada campo
- [ ] Salvar e verificar atualizações
- [ ] Cancelar e verificar se dados não foram alterados

### Teste 3: Seleção Múltipla
- [ ] Selecionar individual
- [ ] Selecionar todos
- [ ] Desselecionar todos
- [ ] Verificar contagem de selecionados

### Teste 4: Edição em Massa
- [ ] Selecionar múltiplas transações
- [ ] Abrir modal de edição em massa
- [ ] Habilitar apenas 1 campo
- [ ] Aplicar alterações
- [ ] Verificar se todas foram atualizadas

### Teste 5: Deleção em Massa
- [ ] Selecionar 3+ transações
- [ ] Clicar em deletar
- [ ] Confirmar deleção
- [ ] Verificar se todas foram removidas

---

## 📞 Suporte

Para dúvidas ou problemas com as novas funcionalidades, consulte o código nos arquivos mencionados acima ou entre em contato com o desenvolvedor.

**Última Atualização**: Janeiro 2026
**Versão**: 2.0
