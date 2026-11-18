const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Check current renderMobileSlotCards implementation
const startMarker = '    function renderMobileSlotCards() {';
const endMarker = '    function selectMobileSlot(colIndex) {';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Could not find renderMobileSlotCards boundaries');
}

const newRenderMobileSlotCards = `    function renderMobileSlotCards() {
      const container = document.getElementById("mobileSlotCardFeed");
      const activeFriends = getActiveFriendsList();

      if (activeFriends.length === 0) {
        container.innerHTML = \`
          <div class="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
            No friends selected in squad. Tap "All" to view schedule.
          </div>
        \`;
        return;
      }

      const isSoleStudent = activeFriends.length === 1;
      const soleStudent = isSoleStudent ? activeFriends[0] : null;
      const currentLiveSlotIdx = getCurrentLiveSlotIndex(selectedMasterDay);

      // Render 7 slots for the chosen day
      container.innerHTML = TIME_COLUMNS.map((col, idx) => {
        const occ = getSlotOccupancy(selectedMasterDay, idx);
        const total = occ.freeFriends.length + occ.busyFriends.length;
        const allFree = occ.freeFriends.length === total;
        const allBusy = occ.freeFriends.length === 0;

        let badgeStyle = "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
        let statusText = \`\${occ.freeFriends.length}/\${total} Free\`;

        if (isSoleStudent) {
          if (occ.busyFriends.length > 0) {
            badgeStyle = "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800";
            statusText = "In Class";
          } else {
            badgeStyle = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
            statusText = "Free";
          }
        } else if (allFree) {
          badgeStyle = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
          statusText = total === 1 ? "Free" : "All Free";
        } else if (allBusy) {
          badgeStyle = "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800";
          statusText = total === 1 ? "In Class" : "All In Class";
        }

        const isCurrentSlotLive = (currentLiveSlotIdx === idx);
        const isHighlighted = (selectedSlotIndex !== null)
          ? (selectedSlotIndex === idx)
          : isCurrentSlotLive;

        // When a single student is selected, compute classmates and same-slot squad members
        let sameClassFriends = [];
        let sameSlotBusyFriends = [];
        let sameSlotFreeFriends = [];
        let soleCourse = null;

        if (isSoleStudent) {
          const slotCode = DAY_MATRIX[selectedMasterDay][idx];
          const soleMap = getFriendSlotMap(soleStudent);
          soleCourse = soleMap[slotCode];

          const otherFriends = FRIENDS_DATA.filter(f => f.id !== soleStudent.id);
          otherFriends.forEach(other => {
            const otherMap = getFriendSlotMap(other);
            const otherCourse = otherMap[slotCode];
            if (otherCourse) {
              if (soleCourse && (
                (otherCourse.code && soleCourse.code && otherCourse.code.toUpperCase() === soleCourse.code.toUpperCase()) ||
                (otherCourse.faculty && soleCourse.faculty && otherCourse.faculty.trim().toLowerCase() === soleCourse.faculty.trim().toLowerCase())
              )) {
                sameClassFriends.push({ friend: other, course: otherCourse });
              } else {
                sameSlotBusyFriends.push({ friend: other, course: otherCourse });
              }
            } else {
              sameSlotFreeFriends.push(other);
            }
          });

          sameClassFriends.sort((a, b) => a.friend.name.localeCompare(b.friend.name));
          sameSlotBusyFriends.sort((a, b) => a.friend.name.localeCompare(b.friend.name));
          sameSlotFreeFriends.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Identify classmates sharing the exact same teacher in this slot (for All mode)
        const teacherCounts = {};
        occ.busyFriends.forEach(({ course }) => {
          const fKey = (course.faculty || "").trim().toLowerCase();
          if (fKey) {
            teacherCounts[fKey] = (teacherCounts[fKey] || 0) + 1;
          }
        });

        // Minimal, elegant theme palette for shared classmate groups (muted colored left stripe)
        const CLASSMATE_BORDER_THEMES = [
          "border-l-[3.5px] border-l-blue-500 dark:border-l-blue-400",
          "border-l-[3.5px] border-l-emerald-500 dark:border-l-emerald-400",
          "border-l-[3.5px] border-l-purple-500 dark:border-l-purple-400",
          "border-l-[3.5px] border-l-amber-500 dark:border-l-amber-400",
          "border-l-[3.5px] border-l-rose-500 dark:border-l-rose-400"
        ];

        const sharedTeachers = Object.keys(teacherCounts).filter(k => teacherCounts[k] > 1);
        const teacherThemeMap = {};
        sharedTeachers.forEach((k, tIdx) => {
          teacherThemeMap[k] = CLASSMATE_BORDER_THEMES[tIdx % CLASSMATE_BORDER_THEMES.length];
        });

        return \`
          <div
            onclick="selectMobileSlot(\${idx})"
            class="bg-white dark:bg-slate-900 border rounded-2xl p-3.5 shadow-2xs transition active:scale-[0.99] cursor-pointer \${isHighlighted
            ? 'border-brandBlue ring-2 ring-blue-100 dark:ring-blue-950'
            : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }"
          >
            <!-- Card Header: Slot Name + Time + Status Badge -->
            <div class="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2">
                <span class="font-mono font-black text-sm px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                  \${occ.slotCode}
                </span>
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                  \${col.start} – \${col.end}
                </span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border \${badgeStyle}">
                \${statusText}
              </span>
            </div>

            <!-- Card Body: Busy Classes & Direct Free Students Display -->
            <div class="space-y-2">
              \${isSoleStudent ? \`
                <!-- INDIVIDUAL STUDENT SINGLE VIEW: Shows Your Class + Who is in same slot -->
                \${soleCourse ? \`
                  <div class="space-y-1.5">
                    <div class="flex items-start justify-between text-xs py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100/80 dark:border-slate-700/60">
                      <div class="min-w-0 pr-2 space-y-0.5">
                        <div class="font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                          <span>\${soleStudent.name.split(" ")[0]}</span>
                          <span class="text-brandBlue font-mono font-semibold">\${soleCourse.code}</span>
                        </div>
                        <div class="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          \${soleCourse.title}
                        </div>
                        <div class="text-[10.5px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                          <i class="fa-solid fa-user-tie text-[9px] text-slate-400 dark:text-slate-500"></i>
                          <span class="font-medium text-slate-600 dark:text-slate-300">\${soleCourse.faculty.split(" - ")[0]}</span>
                        </div>
                      </div>
                      <span class="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border dark:border-amber-900/60 shrink-0 mt-0.5">
                        \${soleCourse.venue}
                      </span>
                    </div>
                  </div>
                \` : \`
                  <div class="flex items-center gap-2 py-1 px-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <i class="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
                    <span>\${soleStudent.name.split(" ")[0]} is Free in this slot</span>
                  </div>
                \`}

                <!-- SQUAD MEMBERS IN SAME SLOT -->
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <i class="fa-solid fa-users text-[9px]"></i>
                    <span>Squad Members in this Slot:</span>
                  </div>

                  \${sameClassFriends.length > 0 ? \`
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-[11px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        <i class="fa-solid fa-user-group text-[10px] text-blue-500"></i> In your class (\${sameClassFriends.length}):
                      </span>
                      <div class="flex items-center gap-1 flex-wrap">
                        \${sameClassFriends.map(({ friend }) => \`
                          <span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold">
                            \${friend.name.split(" ")[0]}
                          </span>
                        \`).join("")}
                      </div>
                    </div>
                  \` : ''}

                  \${sameSlotBusyFriends.length > 0 ? \`
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <i class="fa-solid fa-clock text-[10px] text-slate-400"></i> In same slot (\${sameSlotBusyFriends.length}):
                      </span>
                      <div class="flex items-center gap-1 flex-wrap">
                        \${sameSlotBusyFriends.map(({ friend, course }) => \`
                          <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium" title="\${course.code} • \${course.venue} (\${course.faculty.split(' - ')[0]})">
                            \${friend.name.split(" ")[0]} <span class="font-mono text-[9px] text-slate-400 dark:text-slate-500 font-normal">(\${course.code})</span>
                          </span>
                        \`).join("")}
                      </div>
                    </div>
                  \` : ''}

                  \${sameSlotFreeFriends.length > 0 ? \`
                    <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <i class="fa-solid fa-circle-check text-[10px] text-emerald-500"></i> Free (\${sameSlotFreeFriends.length}):
                      </span>
                      <div class="flex items-center gap-1 flex-wrap">
                        \${sameSlotFreeFriends.map(f => \`
                          <span class="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] font-medium">
                            \${f.name.split(" ")[0]}
                          </span>
                        \`).join("")}
                      </div>
                    </div>
                  \` : ''}
                </div>
              \` : \`
                <!-- ALL MODE: Normal feed showing all friends in class -->
                \${occ.busyFriends.length > 0 ? \`
                  <div class="space-y-1.5">
                    \${occ.busyFriends.map(({ friend, course }) => {
              const fKey = (course.faculty || "").trim().toLowerCase();
              const borderTheme = teacherThemeMap[fKey];
              const cardBorder = borderTheme
                ? \`\${borderTheme} border-y border-r border-slate-100/80 dark:border-slate-700/60\`
                : \`border border-slate-100/80 dark:border-slate-700/60\`;

              return \`
                      <div class="flex items-start justify-between text-xs py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 \${cardBorder}">
                        <div class="min-w-0 pr-2 space-y-0.5">
                          <div class="font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                            <span>\${friend.name.split(" ")[0]}</span>
                            <span class="text-brandBlue font-mono font-semibold">\${course.code}</span>
                          </div>
                          <div class="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                            \${course.title}
                          </div>
                          <div class="text-[10.5px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                            <i class="fa-solid fa-user-tie text-[9px] text-slate-400 dark:text-slate-500"></i>
                            <span class="font-medium text-slate-600 dark:text-slate-300">\${course.faculty.split(" - ")[0]}</span>
                          </div>
                        </div>
                        <span class="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border dark:border-amber-900/60 shrink-0 mt-0.5">
                          \${course.venue}
                        </span>
                      </div>
                    \`;
            }).join("")}
                  </div>
                \` : ''}

                <!-- Directly show who are free in this slot -->
                \${occ.freeFriends.length > 0 ? \`
                  <div class="pt-1.5 \${occ.busyFriends.length > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                        <i class="fa-solid fa-circle-check text-emerald-500 text-[11px]"></i> Free (\${occ.freeFriends.length}):
                      </span>
                      <div class="flex items-center gap-1 flex-wrap">
                        \${occ.freeFriends.map(f => \`
                          <span class="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] font-semibold">
                            \${f.name.split(" ")[0]}
                          </span>
                        \`).join("")}
                      </div>
                    </div>
                  </div>
                \` : \`
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 italic pt-0.5 text-center">
                    All active students in class
                  </div>
                \`}
              \`}
            </div>
          </div>
        \`;
      }).join("");
    }
\n`;

html = html.slice(0, startIdx) + newRenderMobileSlotCards + html.slice(endIdx);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated renderMobileSlotCards in index.html!');
