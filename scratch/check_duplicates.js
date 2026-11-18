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
    rawName: p[0] ? p[0].trim() : '',
    school: p[1] ? p[1].trim() : '',
    phone: p[2] ? p[2].trim() : '',
    room: p[3] ? p[3].trim() : ''
  };
}).filter(f => f.rawName.length > 0);

console.log('Total non-empty rows:', list.length);

// Check duplicate names
const nameCounts = {};
list.forEach(f => {
  const norm = f.rawName.toLowerCase();
  nameCounts[norm] = (nameCounts[norm] || 0) + 1;
});

const duplicates = Object.entries(nameCounts).filter(([k, v]) => v > 1);
console.log('Duplicates count:', duplicates.length);
duplicates.forEach(([name, count]) => {
  const matches = list.filter(f => f.rawName.toLowerCase() === name);
  console.log(`- "${name}" (${count} times):`, JSON.stringify(matches));
});
