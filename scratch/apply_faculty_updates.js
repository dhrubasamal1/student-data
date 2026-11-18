const fs = require('fs');

const facultyBlock = fs.readFileSync('scratch/faculty_js_block.js', 'utf8').replace(/\r\n/g, '\n');
let html = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

// 1. Update Aditya's teacher name typo: HIMANSHU -> HIMANSHI
html = html.replace(
  'faculty: "HIMANSHU HARISH SHARMA - SASL"',
  'faculty: "HIMANSHI HARISH SHARMA - SASL"'
);

// 2. Insert ALL_FACULTY_DATA right before EXTRA_FACULTY_DATA
if (!html.includes('const ALL_FACULTY_DATA =')) {
  const extraFacultyMarker = 'const EXTRA_FACULTY_DATA = [';
  if (!html.includes(extraFacultyMarker)) {
    throw new Error('EXTRA_FACULTY_DATA marker not found in index.html');
  }
  html = html.replace(extraFacultyMarker, facultyBlock + '\n\n    ' + extraFacultyMarker);
}

// 3. Update reviewModal header to include reviewModalDetails
const modalHeaderTarget = `<p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Rate & review this teacher for fellow
              students</p>`;
if (html.includes(modalHeaderTarget) && !html.includes('id="reviewModalDetails"')) {
  html = html.replace(
    modalHeaderTarget,
    `<div id="reviewModalDetails" class="flex items-center gap-1.5 flex-wrap mt-1 text-[10px]"></div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Rate & review this teacher for fellow students</p>`
  );
}

// 4. Update teacher search input placeholder
html = html.replace(
  'placeholder="Search teacher by name or school (e.g. Navneet, SCOPE)..."',
  'placeholder="Search by teacher, cabin (e.g. A-401), school, or phone..."'
);

// 5. Replace getTeacherDirectory() and findFacultyRecord
const oldGetTeacherDirRegex = /function getTeacherDirectory\(\) \{[\s\S]*?return Array\.from\(teacherMap\.values\(\)\)\.sort\(\(a, b\) => a\.teacherName\.localeCompare\(b\.teacherName\)\);\s*\}/;

const newGetTeacherDirCode = `function findFacultyRecord(teacherName, school) {
      if (!teacherName || typeof ALL_FACULTY_DATA === "undefined" || !Array.isArray(ALL_FACULTY_DATA)) return null;
      const getTokens = (str) => {
        return (str || "")
          .toLowerCase()
          .replace(/\\b(dr|prof|mr|mrs|ms)\\b\\.?/gi, "")
          .replace(/[^a-z0-9\\s]/gi, " ")
          .trim()
          .split(/\\s+/)
          .filter(t => t.length > 0);
      };

      const tTokens = getTokens(teacherName);
      if (tTokens.length === 0) return null;

      const sigT = tTokens.filter(t => t.length > 1);
      const tJoined = tTokens.join(" ");

      let best = null;
      let bestScore = 0;

      for (let i = 0; i < ALL_FACULTY_DATA.length; i++) {
        const f = ALL_FACULTY_DATA[i];
        const fTokens = getTokens(f.name);
        if (fTokens.length === 0) continue;
        const sigF = fTokens.filter(t => t.length > 1);
        const fJoined = fTokens.join(" ");

        if (tJoined === fJoined) {
          return f;
        }

        if (sigT.length > 0 && sigF.length > 0) {
          if (sigT.every(t => sigF.includes(t)) || sigF.every(t => sigT.includes(t))) {
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

    function getTeacherDirectory() {
      const teacherMap = new Map();
      const claimedFaculty = new Set();

      // 1. Ingest faculty registered in squad timetables (excluding training platforms like IAMNEO/FACE TRAINER)
      FRIENDS_DATA.forEach(friend => {
        friend.courses.forEach(course => {
          const rawFaculty = (course.faculty || "").trim();
          if (!rawFaculty || isExcludedReviewFaculty(rawFaculty)) return;

          if (!teacherMap.has(rawFaculty)) {
            const parts = rawFaculty.split(" - ");
            const teacherName = parts[0]?.trim() || rawFaculty;
            const school = parts[1]?.trim() || "";

            const matchedRecord = findFacultyRecord(teacherName, school);
            let roomNumber = "";
            let phoneNumber = "";
            if (matchedRecord) {
              roomNumber = matchedRecord.room || "";
              phoneNumber = matchedRecord.phone || "";
              claimedFaculty.add(matchedRecord);
            }

            teacherMap.set(rawFaculty, {
              rawFaculty,
              teacherName,
              school: school || (matchedRecord ? matchedRecord.school : ""),
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
          const rawFaculty = extra.rawFaculty ? extra.rawFaculty.trim() : (school ? \`\${teacherName} - \${school}\` : teacherName);

          const matchedRecord = findFacultyRecord(teacherName, school);
          let roomNumber = extra.roomNumber || (matchedRecord ? matchedRecord.room : "") || "";
          let phoneNumber = extra.phoneNumber || (matchedRecord ? matchedRecord.phone : "") || "";
          if (matchedRecord) claimedFaculty.add(matchedRecord);

          if (!teacherMap.has(rawFaculty)) {
            teacherMap.set(rawFaculty, {
              rawFaculty,
              teacherName,
              school: school || (matchedRecord ? matchedRecord.school : ""),
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

      // 3. Ingest all other faculty from complete directory ALL_FACULTY_DATA
      if (typeof ALL_FACULTY_DATA !== "undefined" && Array.isArray(ALL_FACULTY_DATA)) {
        ALL_FACULTY_DATA.forEach(f => {
          if (!f || !f.name || claimedFaculty.has(f)) return;
          if (isExcludedReviewFaculty(f.name)) return;
          const teacherName = f.name.trim();
          const school = (f.school || "").trim();
          const rawFaculty = school ? \`\${teacherName} - \${school}\` : teacherName;

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
      }

      return Array.from(teacherMap.values()).sort((a, b) => a.teacherName.localeCompare(b.teacherName));
    }`;

if (!oldGetTeacherDirRegex.test(html)) {
  throw new Error('getTeacherDirectory regex did not match in index.html');
}
html = html.replace(oldGetTeacherDirRegex, newGetTeacherDirCode);

// 6. Update search query in renderTeacherFinder
const oldFilterRegex = /const matchingTeachers = allTeachers\.filter\(t => \{[\s\S]*?return matchesName \|\| matchesRaw \|\| matchesSchool \|\| matchesCourse \|\| matchesSubject;\s*\}\);/;

const newFilterCode = `const matchingTeachers = allTeachers.filter(t => {
        if (!q) return true;
        const matchesName = t.teacherName.toLowerCase().includes(q);
        const matchesRaw = t.rawFaculty.toLowerCase().includes(q);
        const matchesSchool = t.school.toLowerCase().includes(q);
        const matchesRoom = (t.roomNumber || "").toLowerCase().includes(q);
        const matchesPhone = (t.phoneNumber || "").toLowerCase().includes(q);
        const matchesCourse = Object.values(t.studentRecords).some(sr =>
          sr.courses.some(c => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
        );
        const matchesSubject = (t.subjects || []).some(s => s.toLowerCase().includes(q));
        return matchesName || matchesRaw || matchesSchool || matchesRoom || matchesPhone || matchesCourse || matchesSubject;
      });`;

if (!oldFilterRegex.test(html)) {
  throw new Error('matchingTeachers filter regex did not match in index.html');
}
html = html.replace(oldFilterRegex, newFilterCode);

// 7. Update Teacher Card rendering in renderTeacherFinder
const oldTeacherHeader = `            <!-- Teacher Header -->
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h3 class="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    \${t.teacherName}
                  </h3>
                  \${t.school ? \`
                    <span class="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      \${t.school}
                    </span>
                  \` : ''}
                </div>
              </div>
              \${isExtraOnly ? matchBadgeHtml : ''}
            </div>`;

const newTeacherHeader = `            <!-- Teacher Header -->
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h3 class="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    \${t.teacherName}
                  </h3>
                  \${t.school ? \`
                    <span class="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      \${t.school}
                    </span>
                  \` : ''}
                </div>
                \${(t.roomNumber || t.phoneNumber) ? \`
                  <div class="flex items-center gap-1.5 flex-wrap mt-1.5">
                    \${t.roomNumber ? \`
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-[10px] font-bold">
                        <i class="fa-solid fa-door-closed text-[9px] text-amber-600 dark:text-amber-400"></i> Cabin: \${t.roomNumber}
                      </span>
                    \` : ''}
                    \${t.phoneNumber ? \`
                      <a href="tel:\${t.phoneNumber.split('/')[0].trim().replace(/\\s+/g, '')}" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 text-[10px] font-bold hover:underline transition">
                        <i class="fa-solid fa-phone text-[9px] text-emerald-600 dark:text-emerald-400"></i> \${t.phoneNumber}
                      </a>
                    \` : ''}
                  </div>
                \` : ''}
              </div>
              \${isExtraOnly ? matchBadgeHtml : ''}
            </div>`;

if (!html.includes(oldTeacherHeader)) {
  throw new Error('oldTeacherHeader not found in index.html');
}
html = html.replace(oldTeacherHeader, newTeacherHeader);

// 8. Update Extra Faculty Info Card in renderTeacherFinder
const oldExtraCard = `            \${isExtraOnly ? \`
              <!-- Extra Faculty Info Card -->
              <div class="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-3 text-xs space-y-1.5">
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Faculty Information:
                </div>
                \${t.subjects && t.subjects.length > 0 ? \`
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Courses:</span>
                    \${t.subjects.map(s => \`
                      <span class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-semibold text-brandBlue dark:text-blue-400">
                        \${s}
                      </span>
                    \`).join("")}
                  </div>
                \` : ''}
                <div class="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Not currently registered with any squad member. You can still rate & review this faculty below!
                </div>
              </div>
            \``;

const newExtraCard = `            \${isExtraOnly ? \`
              <!-- Extra Faculty Info Card -->
              <div class="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-3 text-xs space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Faculty Directory Details:
                  </div>
                  \${t.school ? \`<span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">\${t.school}</span>\` : ''}
                </div>
                \${(t.roomNumber || t.phoneNumber) ? \`
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                    \${t.roomNumber ? \`
                      <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                        <i class="fa-solid fa-door-open text-amber-500 text-xs w-3.5 text-center"></i>
                        <span>Cabin: <strong class="font-bold text-slate-800 dark:text-slate-200">\${t.roomNumber}</strong></span>
                      </div>
                    \` : ''}
                    \${t.phoneNumber ? \`
                      <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                        <i class="fa-solid fa-phone text-emerald-500 text-xs w-3.5 text-center"></i>
                        <a href="tel:\${t.phoneNumber.split('/')[0].trim().replace(/\\s+/g, '')}" class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                          \${t.phoneNumber}
                        </a>
                      </div>
                    \` : ''}
                  </div>
                \` : ''}
                \${t.subjects && t.subjects.length > 0 ? \`
                  <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Courses:</span>
                    \${t.subjects.map(s => \`
                      <span class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-semibold text-brandBlue dark:text-blue-400">
                        \${s}
                      </span>
                    \`).join("")}
                  </div>
                \` : ''}
                <div class="text-[11px] text-slate-400 dark:text-slate-500 italic pt-0.5">
                  Not currently registered with any squad member. You can still rate & review this faculty below!
                </div>
              </div>
            \``;

if (!html.includes(oldExtraCard)) {
  throw new Error('oldExtraCard not found in index.html');
}
html = html.replace(oldExtraCard, newExtraCard);

// 9. Update openReviewModal to populate reviewModalDetails
const oldOpenReviewModalStart = `      const schoolEl = document.getElementById("reviewModalSchool");
      if (schoolEl) {
        if (teacher.school) {
          schoolEl.textContent = teacher.school;
          schoolEl.classList.remove("hidden");
        } else {
          schoolEl.classList.add("hidden");
        }
      }`;

const newOpenReviewModalDetails = `      const schoolEl = document.getElementById("reviewModalSchool");
      if (schoolEl) {
        if (teacher.school) {
          schoolEl.textContent = teacher.school;
          schoolEl.classList.remove("hidden");
        } else {
          schoolEl.classList.add("hidden");
        }
      }

      const detailsEl = document.getElementById("reviewModalDetails");
      if (detailsEl) {
        let detailsHtml = "";
        if (teacher.roomNumber) {
          detailsHtml += \`
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 font-bold">
              <i class="fa-solid fa-door-closed text-[9px]"></i> Cabin: \${teacher.roomNumber}
            </span>
          \`;
        }
        if (teacher.phoneNumber) {
          detailsHtml += \`
            <a href="tel:\${teacher.phoneNumber.split('/')[0].trim().replace(/\\s+/g, '')}" class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 font-bold hover:underline">
              <i class="fa-solid fa-phone text-[9px]"></i> \${teacher.phoneNumber}
            </a>
          \`;
        }
        detailsEl.innerHTML = detailsHtml;
      }`;

if (!html.includes(oldOpenReviewModalStart)) {
  throw new Error('oldOpenReviewModalStart not found in index.html');
}
html = html.replace(oldOpenReviewModalStart, newOpenReviewModalDetails);

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html successfully updated!');
