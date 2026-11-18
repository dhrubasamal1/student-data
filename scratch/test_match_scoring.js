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
    name: p[0] ? p[0].trim() : '',
    school: p[1] ? p[1].trim() : '',
    phone: p[2] ? p[2].trim() : '',
    room: p[3] ? p[3].trim() : ''
  };
}).filter(f => f.name.length > 0);

const html = fs.readFileSync('index.html', 'utf8');
const friendsMatch = html.match(/const FRIENDS_DATA\s*=\s*(\[[^;]+\]);\s*\/\*\*/s);
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

function cleanToken(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getTokens(name) {
  return name
    .toLowerCase()
    .replace(/\b(dr|prof|mr|mrs|ms)\b\.?/gi, '')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(t => t.length > 0);
}

function scoreMatch(tName, fName, tSchool, fSchool) {
  const tTokens = getTokens(tName);
  const fTokens = getTokens(fName);

  if (tTokens.length === 0 || fTokens.length === 0) return 0;

  // Exact token match
  const tStr = tTokens.join(' ');
  const fStr = fTokens.join(' ');
  if (tStr === fStr) return 100;

  // Check if all significant tokens (length > 1) in tTokens are in fTokens
  const sigT = tTokens.filter(t => t.length > 1);
  const sigF = fTokens.filter(t => t.length > 1);

  if (sigT.length > 0 && sigT.every(t => sigF.includes(t))) {
    // If single token like "ABHISHEK", check school if both present
    if (sigT.length === 1 && sigF.length > 1) {
      if (tSchool && fSchool && tSchool.toUpperCase() !== fSchool.toUpperCase()) {
        return 0; // different school, could be different person
      }
      return 85;
    }
    return 95;
  }

  // Check reversed or initials: e.g. "KANNAN S" vs "Dr. S. Kannan" or "Dr. Kannan S"
  // If tokens contain same set of letters/initials
  const tInitials = tTokens.map(t => t[0]).sort().join('');
  const fInitials = fTokens.map(t => t[0]).sort().join('');
  
  // Cross token inclusion
  let matchedTokens = 0;
  for (let tt of sigT) {
    if (sigF.includes(tt)) matchedTokens++;
  }
  if (matchedTokens >= 2 && matchedTokens === sigT.length) return 90;
  if (matchedTokens >= 2 && matchedTokens === sigF.length) return 90;

  return 0;
}

const matches = [];
const unmatched = [];

timetableTeachers.forEach((t) => {
  let best = null;
  let bestScore = 0;

  csvFaculty.forEach(f => {
    const sc = scoreMatch(t.teacherName, f.name, t.school, f.school);
    if (sc > bestScore) {
      bestScore = sc;
      best = f;
    }
  });

  if (bestScore >= 80) {
    matches.push({
      timetable: t.rawFaculty,
      matchedWith: `${best.name} (${best.school})`,
      room: best.room,
      phone: best.phone,
      score: bestScore
    });
  } else {
    unmatched.push(t);
  }
});

console.log(`Matched ${matches.length} / ${timetableTeachers.size}`);
console.log('Sample matches (first 10):', matches.slice(0, 10));
console.log('Unmatched count:', unmatched.length);
console.log('Unmatched:', unmatched.map(u => u.rawFaculty));
