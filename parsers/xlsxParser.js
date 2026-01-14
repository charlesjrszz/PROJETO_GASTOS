const XLSX = require('xlsx');

function parseSpreadsheet(buffer, ext) {
  // buffer: Buffer
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '' });

  // Try to map common columns
  const txs = json.map(row => {
    // heuristics
    const date = row.Date || row.date || row['Data'] || row['data'] || '';
    const description = row.Description || row['Descrição'] || row.descricao || row['descricao'] || row['Descrição/Hist'] || '';
    const amount = row.Amount || row['Valor'] || row['amount'] || row['valor'] || row['Valor (R$)'] || '';
    const account = row.Account || row['Conta'] || '';
    return { date: normalizeDate(date), description: String(description), amount: parseFloat(String(amount).replace(/[R$\s.]/g,'').replace(',','.')) || 0, currency: 'BRL', account, category: '' };
  });

  return txs;
}

function normalizeDate(d) {
  if (!d) return '';
  // if already in ISO yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d;
  // dd/mm/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}/.test(d)) {
    const [dd,mm,yy] = d.split('/');
    return `${yy}-${mm}-${dd}`;
  }
  // try parse
  const dt = new Date(d);
  if (!isNaN(dt)) return dt.toISOString().slice(0,10);
  return d;
}

module.exports = { parseSpreadsheet };
