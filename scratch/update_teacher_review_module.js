const fs = require('fs');

const facultyBlock = fs.readFileSync('scratch/faculty_js_block.js', 'utf8')
  .replace('const ALL_FACULTY_DATA =', 'export const ALL_FACULTY_DATA =')
  .replace(/\r\n/g, '\n');

const currentModule = fs.readFileSync('teacher_review/teacher_review.js', 'utf8').replace(/\r\n/g, '\n');

const additionalExports = `
${facultyBlock}

/**
 * Search faculty directory by query (matches name, cabin room, school code, or phone number)
 */
export function searchFacultyDirectory(query = "", list = ALL_FACULTY_DATA) {
  if (!query || !query.trim()) return list;
  const q = query.trim().toLowerCase();
  return list.filter(f => {
    const matchesName = (f.name || "").toLowerCase().includes(q);
    const matchesSchool = (f.school || "").toLowerCase().includes(q);
    const matchesRoom = (f.room || "").toLowerCase().includes(q);
    const matchesPhone = (f.phone || "").toLowerCase().includes(q);
    return matchesName || matchesSchool || matchesRoom || matchesPhone;
  });
}

/**
 * Lookup faculty members by cabin room number (e.g. "A-401", "B-503")
 */
export function findFacultyByRoom(roomNumber, list = ALL_FACULTY_DATA) {
  if (!roomNumber) return [];
  const q = roomNumber.trim().toLowerCase();
  return list.filter(f => (f.room || "").toLowerCase().includes(q));
}

/**
 * Lookup faculty members by phone number
 */
export function findFacultyByPhone(phoneNumber, list = ALL_FACULTY_DATA) {
  if (!phoneNumber) return [];
  const q = phoneNumber.trim().replace(/[^0-9]/g, "");
  return list.filter(f => (f.phone || "").replace(/[^0-9]/g, "").includes(q));
}
`;

const updatedModule = currentModule.trim() + '\n' + additionalExports;
fs.writeFileSync('teacher_review/teacher_review.js', updatedModule, 'utf8');
console.log('teacher_review/teacher_review.js updated successfully!');
