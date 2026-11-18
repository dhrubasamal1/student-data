const fs = require('fs');

const content = fs.readFileSync('scratch/faculty_data.csv', 'utf8');
const lines = content.split(/\r?\n/).filter(Boolean);
const rows = lines.slice(1);

function parseCsvLine(text) {
  const parts = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i+1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      parts.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  parts.push(cur.trim());
  return parts;
}

const list = rows.map((r, idx) => {
  const p = parseCsvLine(r);
  return {
    name: p[0] ? p[0].trim() : '',
    school: p[1] ? p[1].trim() : '',
    phone: p[2] ? p[2].trim() : '',
    room: p[3] ? p[3].trim() : ''
  };
}).filter(f => f.name.length > 0);

const jsonStr = JSON.stringify(list);
console.log('Total faculty:', list.length);
console.log('JSON size:', jsonStr.length, 'bytes (~' + (jsonStr.length / 1024).toFixed(1) + ' KB)');
