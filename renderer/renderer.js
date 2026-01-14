const importBtn = document.getElementById('importBtn');
const summaryDiv = document.getElementById('summary');
const txTableBody = document.querySelector('#txTable tbody');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');
const applyFilterBtn = document.getElementById('applyFilter');

async function loadTransactions(filter = {}) {
  const tx = await window.electronAPI.getTransactions();
  let list = tx.slice();

  if (filter.from) list = list.filter(t => t.date >= filter.from);
  if (filter.to) list = list.filter(t => t.date <= filter.to);
  if (filter.category) list = list.filter(t => (t.category || '').toLowerCase().includes(filter.category.toLowerCase()));

  txTableBody.innerHTML = '';
  list.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${t.date}</td><td>${t.account || ''}</td><td>${t.description}</td><td>${t.amount}</td><td>${t.category || ''}</td>`;
    txTableBody.appendChild(tr);
  });
}

importBtn.addEventListener('click', async () => {
  summaryDiv.textContent = 'Importando...';
  const res = await window.electronAPI.selectFiles();
  if (res && res.summary) {
    summaryDiv.textContent = res.summary.map(s => `${s.file}: ${s.count} transações`).join('\n');
  }
  await loadTransactions();
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
    const div = document.createElement('div');
    div.style.border = '1px solid #ddd';
    div.style.marginTop = '6px';
    div.style.padding = '6px';
    div.innerHTML = `<strong>${cat.name}</strong> <button data-catid="${cat.id}" class="del-cat">Excluir</button>
      <div>Regras:</div>
      <ul>${(cat.rules || []).map(r => `<li>${r.pattern} <button data-catid="${cat.id}" data-ruleid="${r.id}" class="del-rule">Excluir</button></li>`).join('')}</ul>
      <input placeholder="Nova regra (palavra)" data-newrule-for="${cat.id}" class="new-rule-input"><button data-catid="${cat.id}" class="add-rule">Adicionar regra</button>
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

// initial load
loadTransactions();
loadCategories();
