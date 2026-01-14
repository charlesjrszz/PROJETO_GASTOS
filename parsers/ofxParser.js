function parseOFX(ofxText) {
  // Simple OFX parser: extract <STMTTRN> blocks
  const txs = [];
  const stmtRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
  let match;
  while ((match = stmtRegex.exec(ofxText)) !== null) {
    const block = match[1];
    const dateMatch = /<DTPOSTED>(\d{8})(?:\d{4})?/i.exec(block);
    const amtMatch = /<TRNAMT>([-\d.,]+)/i.exec(block);
    const descMatch = /<NAME>([^<\r\n]+)/i.exec(block) || /<MEMO>([^<\r\n]+)/i.exec(block);

    const date = dateMatch ? `${dateMatch[1].slice(0,4)}-${dateMatch[1].slice(4,6)}-${dateMatch[1].slice(6,8)}` : null;
    const amount = amtMatch ? parseFloat(amtMatch[1].replace(',', '.')) : null;
    const description = descMatch ? descMatch[1].trim() : '';

    txs.push({ date, description, amount, currency: 'BRL', account: '', category: '' });
  }
  return txs;
}

module.exports = { parseOFX };
