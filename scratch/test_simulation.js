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

const ALL_FACULTY_DATA = rows.map((r, idx) => {
  const p = parseCsvLine(r);
  return {
    name: p[0] ? p[0].trim() : '',
    school: p[1] ? p[1].trim() : '',
    phone: p[2] ? p[2].trim() : '',
    room: p[3] ? p[3].trim() : ''
  };
}).filter(f => f.name.length > 0);

const EXTRA_FACULTY_DATA = [
  {
    name: "DR. PRADEEP KUMAR",
    school: "SCOPE",
    rawFaculty: "DR. PRADEEP KUMAR - SCOPE",
    subjects: ["Operating Systems", "Cloud Computing"]
  },
  {
    name: "DR. SARAVANAN R",
    school: "SCOPE",
    rawFaculty: "DR. SARAVANAN R - SCOPE",
    subjects: ["Computer Networks", "Cyber Security"]
  }
];

const html = fs.readFileSync('index.html', 'utf8');
const friendsMatch = html.match(/const FRIENDS_DATA\s*=\s*(\[[^;]+\]);\s*\/\*\*/s);
const FRIENDS_DATA = eval(friendsMatch[1]);

function isExcludedReviewFaculty(nameOrRaw) {
  if (!nameOrRaw) return false;
  const s = String(nameOrRaw).trim().toLowerCase();
  return /^(iamneo|face\s*trainer)/i.test(s) || s.includes("iamneo") || s.includes("face_trainer") || s.includes("facetrainer") || s.includes("face trainer");
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

function findFacultyMatch(teacherName, school, facultyList) {
  const tTokens = getTokens(teacherName);
  if (tTokens.length === 0) return null;

  const sigT = tTokens.filter(t => t.length > 1);
  const tJoined = tTokens.join(' ');

  let best = null;
  let bestScore = 0;

  for (let f of facultyList) {
    const fTokens = getTokens(f.name);
    if (fTokens.length === 0) continue;
    const sigF = fTokens.filter(t => t.length > 1);
    const fJoined = fTokens.join(' ');

    if (tJoined === fJoined) {
      return f;
    }

    if (sigT.length > 0 && sigF.length > 0) {
      if (sigT.every(t => sigF.includes(t)) || sigF.every(t => sigT.includes(t))) {
        // High confidence match
        let score = 90;
        if (school && f.school && school.toUpperCase() === f.school.toUpperCase()) score += 10;
        if (score > bestScore) {
          bestScore = score;
          best = f;
        }
      }
    }
  }

  return bestScore >= 80 ? best : null;
}

function simulateGetTeacherDirectory() {
  const teacherMap = new Map();
  const claimedFaculty = new Set();

  // 1. Ingest faculty registered in squad timetables
  FRIENDS_DATA.forEach(friend => {
    friend.courses.forEach(course => {
      const rawFaculty = (course.faculty || "").trim();
      if (!rawFaculty || isExcludedReviewFaculty(rawFaculty)) return;

      if (!teacherMap.has(rawFaculty)) {
        const parts = rawFaculty.split(" - ");
        const teacherName = parts[0]?.trim() || rawFaculty;
        const school = parts[1]?.trim() || "";

        const match = findFacultyMatch(teacherName, school, ALL_FACULTY_DATA);
        let roomNumber = "";
        let phoneNumber = "";
        if (match) {
          roomNumber = match.room || "";
          phoneNumber = match.phone || "";
          claimedFaculty.add(match);
        }

        teacherMap.set(rawFaculty, {
          rawFaculty,
          teacherName,
          school: school || (match ? match.school : ""),
          roomNumber,
          phoneNumber,
          studentRecords: {},
          isExtraFaculty: false,
          subjects: []
        });
      }

      const entry = teacherMap.get(rawFaculty);
      if (!entry.studentRecords[friend.id]) {
        entry.studentRecords[friend.id] = {
          friend,
          courses: []
        };
      }
      entry.studentRecords[friend.id].courses.push(course);
    });
  });

  // 2. Ingest hardcoded other faculty from EXTRA_FACULTY_DATA
  if (typeof EXTRA_FACULTY_DATA !== "undefined" && Array.isArray(EXTRA_FACULTY_DATA)) {
    EXTRA_FACULTY_DATA.forEach(extra => {
      if (!extra || !extra.name) return;
      if (isExcludedReviewFaculty(extra.name) || isExcludedReviewFaculty(extra.rawFaculty)) return;
      const teacherName = extra.name.trim();
      const school = (extra.school || "").trim();
      const rawFaculty = extra.rawFaculty ? extra.rawFaculty.trim() : (school ? `${teacherName} - ${school}` : teacherName);

      const match = findFacultyMatch(teacherName, school, ALL_FACULTY_DATA);
      let roomNumber = extra.roomNumber || (match ? match.room : "") || "";
      let phoneNumber = extra.phoneNumber || (match ? match.phone : "") || "";
      if (match) claimedFaculty.add(match);

      if (!teacherMap.has(rawFaculty)) {
        teacherMap.set(rawFaculty, {
          rawFaculty,
          teacherName,
          school: school || (match ? match.school : ""),
          roomNumber,
          phoneNumber,
          studentRecords: {},
          isExtraFaculty: true,
          subjects: Array.isArray(extra.subjects) ? extra.subjects : (extra.subjects ? [extra.subjects] : [])
        });
      } else {
        const existing = teacherMap.get(rawFaculty);
        if (roomNumber && !existing.roomNumber) existing.roomNumber = roomNumber;
        if (phoneNumber && !existing.phoneNumber) existing.phoneNumber = phoneNumber;
        if (extra.subjects) {
          const subs = Array.isArray(extra.subjects) ? extra.subjects : [extra.subjects];
          subs.forEach(s => {
            if (!existing.subjects.includes(s)) existing.subjects.push(s);
          });
        }
      }
    });
  }

  // 3. Ingest all other faculty from ALL_FACULTY_DATA
  ALL_FACULTY_DATA.forEach(f => {
    if (!f || !f.name || claimedFaculty.has(f)) return;
    const teacherName = f.name.trim();
    const school = (f.school || "").trim();
    const rawFaculty = school ? `${teacherName} - ${school}` : teacherName;

    if (!teacherMap.has(rawFaculty)) {
      teacherMap.set(rawFaculty, {
        rawFaculty,
        teacherName,
        school,
        roomNumber: f.room || "",
        phoneNumber: f.phone || "",
        studentRecords: {},
        isExtraFaculty: true,
        subjects: []
      });
    } else {
      const existing = teacherMap.get(rawFaculty);
      if (f.room && !existing.roomNumber) existing.roomNumber = f.room;
      if (f.phone && !existing.phoneNumber) existing.phoneNumber = f.phone;
    }
  });

  return Array.from(teacherMap.values()).sort((a, b) => a.teacherName.localeCompare(b.teacherName));
}

const dir = simulateGetTeacherDirectory();
console.log('Total directory teachers:', dir.length);

const pradeep = dir.find(t => t.teacherName.includes("PRADEEP"));
console.log('Pradeep:', pradeep ? { name: pradeep.teacherName, isExtra: pradeep.isExtraFaculty, room: pradeep.roomNumber, phone: pradeep.phoneNumber } : 'NOT FOUND');

const kannan = dir.find(t => t.teacherName.includes("KANNAN"));
console.log('Kannan:', kannan ? { name: kannan.teacherName, isExtra: kannan.isExtraFaculty, room: kannan.roomNumber, phone: kannan.phoneNumber } : 'NOT FOUND');

const navneet = dir.find(t => t.teacherName.includes("NAVNEET"));
console.log('Navneet:', navneet ? { name: navneet.teacherName, isExtra: navneet.isExtraFaculty, room: navneet.roomNumber, phone: navneet.phoneNumber } : 'NOT FOUND');

const benevatho = dir.find(t => t.teacherName.includes("Benevatho"));
console.log('Benevatho:', benevatho ? { name: benevatho.teacherName, isExtra: benevatho.isExtraFaculty, room: benevatho.roomNumber, phone: benevatho.phoneNumber } : 'NOT FOUND');

// Search tests
const searchRoomA401 = dir.filter(t => (t.roomNumber || '').toLowerCase().includes('a-401'));
console.log('Teachers in A-401:', searchRoomA401.map(t => `${t.teacherName} (Room: ${t.roomNumber})`));

const searchPhone9994066779 = dir.filter(t => (t.phoneNumber || '').includes('9994066779'));
console.log('Teacher with phone 9994066779:', searchPhone9994066779.map(t => `${t.teacherName} (Phone: ${t.phoneNumber})`));
