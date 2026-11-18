const fs = require('fs');

const content = fs.readFileSync('scratch/faculty_data.csv', 'utf8');
const lines = content.split(/\r?\n/).filter(Boolean);
const rows = lines.slice(1);

console.log('Total rows:', rows.length);

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
    index: idx + 1,
    name: p[0] ? p[0].trim() : '',
    school: p[1] ? p[1].trim() : '',
    phone: p[2] ? p[2].trim() : '',
    room: p[3] ? p[3].trim() : ''
  };
}).filter(item => item.name.length > 0);

console.log('Valid faculty count:', list.length);
console.log('First 5:', JSON.stringify(list.slice(0, 5), null, 2));
console.log('Last 5:', JSON.stringify(list.slice(-5), null, 2));

// Check schools
const schools = [...new Set(list.map(f => f.school))];
console.log('Schools / Codes:', schools);

// Check rooms
const rooms = list.filter(f => f.room).slice(0, 10);
console.log('Sample rooms:', rooms.map(f => `${f.name} -> Room: ${f.room}`));

// Check phones
const phones = list.filter(f => f.phone).slice(0, 10);
console.log('Sample phones:', phones.map(f => `${f.name} -> Phone: ${f.phone}`));
