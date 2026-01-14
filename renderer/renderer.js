const importBtn = document.getElementById('importBtn');
const summaryDiv = document.getElementById('summary');
const txTableBody = document.querySelector('#txTable tbody');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');
const applyFilterBtn = document.getElementById('applyFilter');

// Elementos de seleção múltipla
const selectAllCheckbox = document.getElementById('selectAll');
const bulkActionsBar = document.getElementById('bulkActionsBar');
const selectedCountSpan = document.getElementById('selectedCount');
const bulkEditBtn = document.getElementById('bulkEditBtn');
const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
const bulkCancelBtn = document.getElementById('bulkCancelBtn');

// Modais
const editModal = document.getElementById('editModal');
const bulkEditModal = document.getElementById('bulkEditModal');
const editForm = document.getElementById('editForm');
const bulkEditForm = document.getElementById('bulkEditForm');
const closeEditModal = document.getElementById('closeEditModal');
const closeBulkEditModal = document.getElementById('closeBulkEditModal');

// --- NOVOS ELEMENTOS: Histórico Turso ---
const cloudHistoryList = document.getElementById('cloudHistoryList');
const refreshHistoryBtn = document.getElementById('refreshHistoryBtn');

// Armazena as transações atuais para referência
let currentTransactions = [];
let selectedIds = new Set();

async function loadTransactions(filter = {}) {
  const tx = await window.electronAPI.getTransactions();
  let list = tx.slice();

  if (filter.from) list = list.filter(t => t.date >= filter.from);
  if (filter.to) list = list.filter(t => t.date <= filter.to);
  if (filter.category) list = list.filter(t => (t.category || '').toLowerCase().includes(filter.category.toLowerCase()));

  currentTransactions = list;
  selectedIds.clear();
  selectAllCheckbox.checked = false;
  updateBulkActionsBar();

  txTableBody.innerHTML = '';
  list.forEach(t => {
    const tr = document.createElement('tr');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'tx-checkbox cursor-pointer';
    checkbox.dataset.id = t.id;
    
    const checkboxTd = document.createElement('td');
    checkboxTd.className = 'p-4';
    checkboxTd.appendChild(checkbox);

    const dateTd = document.createElement('td');
    dateTd.className = 'p-4';
    dateTd.textContent = t.date;

    const accountTd = document.createElement('td');
    accountTd.className = 'p-4';
    accountTd.textContent = t.account || '';

    const descriptionTd = document.createElement('td');
    descriptionTd.className = 'p-4';
    descriptionTd.textContent = t.description;

    const amountTd = document.createElement('td');
    amountTd.className = 'p-4 text-right font-medium';
    amountTd.textContent = t.amount;

    const categoryTd = document.createElement('td');
    categoryTd.className = 'p-4';
    categoryTd.textContent = t.category || '';

    const actionsTd = document.createElement('td');
    actionsTd.className = 'p-4 flex gap-1';
    
    const editBtnSmall = document.createElement('button');
    editBtnSmall.className = 'bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-xs font-medium';
    editBtnSmall.textContent = '✏️ Editar';
    editBtnSmall.onclick = () => openEditModal(t);

    const deleteBtnSmall = document.createElement('button');
    deleteBtnSmall.className = 'bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded text-xs font-medium';
    deleteBtnSmall.textContent = '🗑️ Deletar';
    deleteBtnSmall.onclick = () => deleteTransaction(t.id);

    actionsTd.appendChild(editBtnSmall);
    actionsTd.appendChild(deleteBtnSmall);

    tr.appendChild(checkboxTd);
    tr.appendChild(dateTd);
    tr.appendChild(accountTd);
    tr.appendChild(descriptionTd);
    tr.appendChild(amountTd);
    tr.appendChild(categoryTd);
    tr.appendChild(actionsTd);

    txTableBody.appendChild(tr);

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedIds.add(t.id);
      } else {
        selectedIds.delete(t.id);
      }
      updateBulkActionsBar();
    });
  });

  attachCheckboxListeners();
}

function updateBulkActionsBar() {
  if (selectedIds.size > 0) {
    bulkActionsBar.classList.remove('hidden');
    selectedCountSpan.textContent = `${selectedIds.size} selecionada${selectedIds.size !== 1 ? 's' : ''}`;
  } else {
    bulkActionsBar.classList.add('hidden');
    selectAllCheckbox.checked = false;
  }
}

function attachCheckboxListeners() {
  document.querySelectorAll('.tx-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const allCheckboxes = document.querySelectorAll('.tx-checkbox');
      const checkedCount = Array.from(allCheckboxes).filter(cb => cb.checked).length;
      selectAllCheckbox.checked = checkedCount === allCheckboxes.length && allCheckboxes.length > 0;
    });
  });
}

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

// Funções de Modal
function openEditModal(transaction) {
  document.getElementById('editId').value = transaction.id;
  document.getElementById('editDate').value = transaction.date;
  document.getElementById('editDescription').value = transaction.description;
  document.getElementById('editAmount').value = transaction.amount;
  document.getElementById('editAccount').value = transaction.account || '';
  document.getElementById('editCategory').value = transaction.category || '';
  editModal.classList.remove('hidden');
}

closeEditModal.addEventListener('click', () => {
  editModal.classList.add('hidden');
});

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = Number(document.getElementById('editId').value);
  const transaction = {
    id,
    date: document.getElementById('editDate').value,
    description: document.getElementById('editDescription').value,
    amount: parseFloat(document.getElementById('editAmount').value),
    account: document.getElementById('editAccount').value,
    category: document.getElementById('editCategory').value
  };
  
  // Preservar campos não editáveis
  const originalTx = currentTransactions.find(t => t.id === id);
  Object.assign(transaction, {
    currency: originalTx.currency,
    balance: originalTx.balance
  });

  await window.electronAPI.updateTransaction(transaction);
  editModal.classList.add('hidden');
  await loadTransactions();
});

// Deletar transação individual
async function deleteTransaction(id) {
  if (!confirm('Tem certeza que deseja deletar esta transação?')) return;
  await window.electronAPI.deleteTransaction(id);
  await loadTransactions();
}

// Edição em massa
bulkEditBtn.addEventListener('click', () => {
  document.getElementById('bulkEditCount').textContent = selectedIds.size;
  bulkEditModal.classList.remove('hidden');
});

closeBulkEditModal.addEventListener('click', () => {
  bulkEditModal.classList.add('hidden');
});

// Habilitar campos de edição em massa
document.getElementById('bulkEditDateCheck').addEventListener('change', (e) => {
  document.getElementById('bulkEditDate').disabled = !e.target.checked;
});

document.getElementById('bulkEditCategoryCheck').addEventListener('change', (e) => {
  document.getElementById('bulkEditCategory').disabled = !e.target.checked;
});

document.getElementById('bulkEditAccountCheck').addEventListener('change', (e) => {
  document.getElementById('bulkEditAccount').disabled = !e.target.checked;
});

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

  if (Object.keys(updates).length === 0) {
    alert('Selecione pelo menos um campo para editar');
    return;
  }

  await window.electronAPI.updateTransactionsBulk(Array.from(selectedIds), updates);
  bulkEditModal.classList.add('hidden');
  await loadTransactions();
});

// Deletar em massa
bulkDeleteBtn.addEventListener('click', async () => {
  if (!confirm(`Tem certeza que deseja deletar ${selectedIds.size} transação(ões)?`)) return;
  await window.electronAPI.deleteTransactions(Array.from(selectedIds));
  await loadTransactions();
});

// Cancelar seleção
bulkCancelBtn.addEventListener('click', () => {
  selectedIds.clear();
  selectAllCheckbox.checked = false;
  document.querySelectorAll('.tx-checkbox').forEach(cb => cb.checked = false);
  updateBulkActionsBar();
});

// --- ATUALIZAÇÃO NO BOTÃO DE IMPORTAR ---
importBtn.addEventListener('click', async () => {
  summaryDiv.textContent = 'Importando...';
  const res = await window.electronAPI.selectFiles();
  if (res && res.summary) {
    summaryDiv.textContent = res.summary.map(s => `${s.file}: ${s.count} transações`).join('\n');
  }
  await loadTransactions();
  
  // 🔥 NOVO: Atualiza a lista da nuvem assim que importar
  await loadCloudHistory();
});

refreshBtn.addEventListener('click', () => loadTransactions());
exportBtn.addEventListener('click', async () => {
  const res = await window.electronAPI.exportCSV();
  if (res.saved) alert('Exportado para ' + res.file);
});

applyFilterBtn.addEventListener('click', () => {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const category = document.getElementById('filterCategory').value;
  loadTransactions({ from, to, category });
});

// category management elements
const addCategoryBtn = document.getElementById('addCategoryBtn');
const newCategoryName = document.getElementById('newCategoryName');
const categoriesList = document.getElementById('categoriesList');

addCategoryBtn.addEventListener('click', async () => {
  const name = newCategoryName.value.trim();
  if (!name) return alert('Digite o nome da categoria');
  await window.electronAPI.addCategory({ name });
  newCategoryName.value = '';
  await loadCategories();
});

async function loadCategories() {
  const cats = await window.electronAPI.getCategories();
  renderCategories(cats || []);
}

function renderCategories(cats) {
  categoriesList.innerHTML = '';
  cats.forEach(cat => {
    // Usando classes do Tailwind para ficar bonito
    const div = document.createElement('div');
    div.className = 'bg-slate-50 border border-slate-200 rounded p-2 text-sm';
    
    div.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <strong class="text-indigo-900">${cat.name}</strong> 
        <button data-catid="${cat.id}" class="del-cat text-red-500 text-xs hover:underline">Excluir</button>
      </div>
      <div class="text-xs text-slate-500 mb-1">Regras:</div>
      <ul class="list-disc list-inside text-xs text-slate-600 mb-2 space-y-1">
        ${(cat.rules || []).map(r => `
          <li class="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-100">
            <span>${r.pattern}</span> 
            <button data-catid="${cat.id}" data-ruleid="${r.id}" class="del-rule text-red-400 hover:text-red-600">×</button>
          </li>
        `).join('')}
      </ul>
      <div class="flex gap-1">
        <input placeholder="Nova regra..." data-newrule-for="${cat.id}" class="new-rule-input flex-1 border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-indigo-500">
        <button data-catid="${cat.id}" class="add-rule bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs hover:bg-slate-300">+</button>
      </div>
    `;
    categoriesList.appendChild(div);
  });

  categoriesList.querySelectorAll('.add-rule').forEach(btn => {
    btn.addEventListener('click', async () => {
      const catId = Number(btn.getAttribute('data-catid'));
      const input = categoriesList.querySelector(`input[data-newrule-for="${catId}"]`);
      const pattern = input.value.trim();
      if (!pattern) return alert('Digite a palavra-chave');
      await window.electronAPI.addRule(catId, pattern);
      input.value = '';
      await loadCategories();
      await loadTransactions();
    });
  });

  categoriesList.querySelectorAll('.del-cat').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Excluir categoria?')) return;
      await window.electronAPI.deleteCategory(Number(btn.getAttribute('data-catid')));
      await loadCategories();
      await loadTransactions();
    });
  });

  categoriesList.querySelectorAll('.del-rule').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Excluir regra?')) return;
      const catId = Number(btn.getAttribute('data-catid'));
      const ruleId = Number(btn.getAttribute('data-ruleid'));
      await window.electronAPI.deleteRule(catId, ruleId);
      await loadCategories();
      await loadTransactions();
    });
  });
}

// ==========================================
// ☁️ INTEGRAÇÃO COM TURSO (NOVO)
// ==========================================

async function loadCloudHistory() {
  if (!cloudHistoryList) return;

  // Feedback de carregamento
  cloudHistoryList.innerHTML = '<li class="text-slate-400 italic text-center text-xs">Buscando...</li>';

  try {
      const files = await window.electronAPI.getFileHistory();
      cloudHistoryList.innerHTML = ''; // Limpa a lista

      if (!files || files.length === 0) {
          cloudHistoryList.innerHTML = '<li class="text-slate-400 italic text-center text-xs">Nenhum arquivo na nuvem.</li>';
          return;
      }

      files.forEach(file => {
          // Formatação da data
          const dataFormatada = new Date(file.data_upload).toLocaleString('pt-BR');

          const li = document.createElement('li');
          li.className = "bg-slate-50 p-3 rounded border border-slate-100 flex flex-col gap-2 transition-colors hover:border-indigo-200";
          
          li.innerHTML = `
              <div class="flex justify-between items-start">
                  <span class="font-medium text-slate-700 break-all leading-tight">${file.nome_arquivo}</span>
                  <span class="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">${file.tipo_arquivo || '?'}</span>
              </div>
              <div class="flex justify-between items-end mt-1">
                  <span class="text-[10px] text-slate-400">${dataFormatada}</span>
                  <button onclick="downloadFile(${file.id})" class="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded transition-colors font-medium flex items-center gap-1">
                      ⬇ Baixar
                  </button>
              </div>
          `;
          cloudHistoryList.appendChild(li);
      });

  } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      cloudHistoryList.innerHTML = '<li class="text-red-400 text-center text-xs">Erro ao conectar.</li>';
  }
}

// Função global para ser chamada pelo onclick do HTML
window.downloadFile = async (id) => {
    const btn = event.currentTarget; 
    const originalText = btn.innerHTML;
    btn.innerHTML = "⏳";
    btn.disabled = true;
    
    try {
        const result = await window.electronAPI.downloadFileFromDb(id);
        if (result.success) {
            console.log("Download concluído");
        } else {
            alert("Erro ao baixar arquivo.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro inesperado.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

if (refreshHistoryBtn) {
    refreshHistoryBtn.addEventListener('click', loadCloudHistory);
}

// Inicializações
loadTransactions();
loadCategories();
loadCloudHistory(); // Carrega o histórico ao abrir o app