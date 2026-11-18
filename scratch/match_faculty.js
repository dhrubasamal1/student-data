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

const csvFaculty = rows.map((r, idx) => {
  const p = parseCsvLine(r);
  return {
    id: idx + 1,
    name: p[0] || '',
    school: p[1] || '',
    phone: p[2] || '',
    room: p[3] || ''
  };
}).filter(f => f.name.length > 0);

console.log('Total faculty in CSV:', csvFaculty.length);

// Let's read index.html and get current teachers
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const scriptMatch = scriptMatches[scriptMatches.length - 1];

// We can extract FRIENDS_DATA
const vm = require('vm');
const sandbox = {
  console: { log: () => {}, warn: () => {} }
};
// run script up to FRIENDS_DATA
const friendsMatch = scriptMatch[1].match(/const FRIENDS_DATA\s*=\s*(\[[^;]+\]);\s*\/\*\*/s);
if (!friendsMatch) {
  console.log('Could not find FRIENDS_DATA');
  process.exit(1);
}
const FRIENDS_DATA = eval(friendsMatch[1]);

const timetableTeachers = new Map();
FRIENDS_DATA.forEach(f => {
  f.courses.forEach(c => {
    const raw = (c.faculty || '').trim();
    if (!raw || /iamneo|face\s*trainer/i.test(raw)) return;
    if (!timetableTeachers.has(raw)) {
      const parts = raw.split(' - ');
      timetableTeachers.set(raw, {
        rawFaculty: raw,
        teacherName: parts[0]?.trim() || raw,
        school: parts[1]?.trim() || ''
      });
    }
  });
});

console.log('Unique timetable teachers count:', timetableTeachers.size);

// Name normalization function
function normalizeName(str) {
  return str
    .toLowerCase()
    .replace(/\b(dr|prof|mr|mrs|ms)\b\.?/gi, '')
    .replace(/[^a-z0-9]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

let matchedCount = 0;
const unmatchedTimetable = [];

timetableTeachers.forEach((t, raw) => {
  const normT = normalizeName(t.teacherName);
  const match = csvFaculty.find(f => {
    const normF = normalizeName(f.name);
    return normT === normF || normT.includes(normF) || normF.includes(normT);
  });
  if (match) {
    matchedCount++;
  } else {
    unmatchedTimetable.push({ raw, normT });
  }
});

console.log(`Matched ${matchedCount} / ${timetableTeachers.size} timetable teachers!`);
console.log('Unmatched timetable teachers:', unmatchedTimetable);
