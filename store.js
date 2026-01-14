const Store = require('electron-store');
const store = new Store({ name: 'finance-data' });

function getAllTransactions() {
  return store.get('transactions', []);
}

function addTransaction(tx) {
  const list = store.get('transactions', []);
  // simple id
  tx.id = (list.length ? Math.max(...list.map(t => t.id || 0)) + 1 : 1);

  // apply categorization rules before saving
  const categorized = applyCategoryRules(tx);

  list.push(categorized);
  store.set('transactions', list);
}

function getCategories() {
  return store.get('categories', []);
}

function addCategory(cat) {
  const cats = store.get('categories', []);
  cat.id = (cats.length ? Math.max(...cats.map(c => c.id || 0)) + 1 : 1);
  cat.rules = cat.rules || [];
  cats.push(cat);
  store.set('categories', cats);
  return cat;
}

function updateCategory(cat) {
  const cats = store.get('categories', []);
  const idx = cats.findIndex(c => c.id === cat.id);
  if (idx >= 0) {
    cats[idx] = cat;
    store.set('categories', cats);
    return true;
  }
  return false;
}

function deleteCategory(id) {
  let cats = store.get('categories', []);
  cats = cats.filter(c => c.id !== id);
  store.set('categories', cats);
}

function addRuleToCategory(catId, pattern) {
  const cats = store.get('categories', []);
  const idx = cats.findIndex(c => c.id === catId);
  if (idx === -1) return null;
  const cat = cats[idx];
  cat.rules = cat.rules || [];
  const rule = { id: (cat.rules.length ? Math.max(...cat.rules.map(r => r.id || 0)) + 1 : 1), pattern };
  cat.rules.push(rule);
  cats[idx] = cat;
  store.set('categories', cats);
  return rule;
}

function deleteRuleFromCategory(catId, ruleId) {
  const cats = store.get('categories', []);
  const idx = cats.findIndex(c => c.id === catId);
  if (idx === -1) return false;
  const cat = cats[idx];
  cat.rules = (cat.rules || []).filter(r => r.id !== ruleId);
  cats[idx] = cat;
  store.set('categories', cats);
  return true;
}

function applyCategoryRules(tx) {
  const cats = store.get('categories', []);
  const text = (tx.description || '').toLowerCase();
  for (const cat of cats) {
    if (!cat.rules) continue;
    for (const rule of cat.rules) {
      if (!rule.pattern) continue;
      if (text.includes(rule.pattern.toLowerCase())) {
        tx.category = cat.name;
        return tx;
      }
    }
  }
  return tx;
}

module.exports = {
  getAllTransactions,
  addTransaction,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addRuleToCategory,
  deleteRuleFromCategory
};
