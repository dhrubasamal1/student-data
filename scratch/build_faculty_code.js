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

console.log('Total valid faculty:', list.length);

// Format as JS code
const jsLines = [
  '    /**',
  '     * ========================================================================',
  '     * COMPLETE VIT BHOPAL FACULTY DIRECTORY (326+ FACULTY MEMBERS)',
  '     * Ingested from Combined_Faculty_List.csv',
  '     * Includes: Teacher Name, School/Department Code, Phone Number, Room/Cabin Number',
  '     * ========================================================================',
  '     */',
  '    const ALL_FACULTY_DATA = ' + JSON.stringify(list, null, 6) + ';'
];

fs.writeFileSync('scratch/faculty_js_block.js', jsLines.join('\n'), 'utf8');
console.log('Saved faculty_js_block.js successfully!');
