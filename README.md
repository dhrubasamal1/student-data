==============================================================================
CAMPUS SAATHI - VIT BHOPAL
Smart timetable, squad schedule sync, teacher finder & reviews, parcel helper
==============================================================================

Repository : github.com/dhrubasamal1/student-data
Live site  : student-data-crl.pages.dev (Cloudflare Pages)
Type       : Installable web app (PWA), static files, no build step
Last doc update: 20 Nov 2026


------------------------------------------------------------------------------
1. WHAT IT IS
------------------------------------------------------------------------------
Campus Saathi is a mobile-first web app for VIT Bhopal students. It shows each
student's timetable, syncs schedules across a friend "squad", lets students
search the faculty directory, rate teachers, and match free squad members with
campus parcel-collection requests.


------------------------------------------------------------------------------
2. FEATURES
------------------------------------------------------------------------------
Schedule
  - Unified Schedule menu with integrated registered courses and stats
  - Live-class indicator (blinking green dot beside the time)
  - Registered courses show which squad members share the exact same class
  - Academic calendar (exams, holidays and other dated events)

Squad
  - Per-student timetables for the squad (slots, venues, faculty per course)
  - Schedule sync / free-time comparison across squad members

Teacher finder
  - Faculty directory (name, school, room, contact details)
  - Fuzzy search: typo tolerance, punctuation normalisation, relevance scoring
  - Lookup by room, phone, or email

Teacher reviews
  - Anonymous rating (1-5), class average difficulty, behaviour (strict/chill),
    late-entry rule, and a short comment
  - Stored in Firestore (see section 6)

Parcel helper
  - Students post parcel-collection requests; squad members who are free or
    walking past the parcel counter can claim them
  - Requests sync live through Firestore
  - Local cache keeps requests visible if the cloud sync fails

PWA
  - Installable on phones (manifest.json), cached by a service worker (sw.js)


------------------------------------------------------------------------------
3. TECH STACK
------------------------------------------------------------------------------
  - Plain HTML, CSS, JavaScript (no framework, no bundler)
  - Tailwind CSS via CDN (cdn.tailwindcss.com)
  - Firebase JS SDK 10.12.0, compat build: firebase-app-compat and
    firebase-firestore-compat (loaded from gstatic.com)
  - Cloud Firestore for reviews and parcel requests
  - Cloudflare Pages for hosting
  - Python 3 only for the optional icon-generation script


------------------------------------------------------------------------------
4. REPOSITORY LAYOUT
------------------------------------------------------------------------------
  index.html            The whole app: UI, CSS, embedded data, app logic,
                        Firebase config, service worker registration (~3,400
                        lines). THIS IS THE FILE THE LIVE SITE USES.
  sw.js                 Service worker (offline cache of the app shell)
  manifest.json         PWA manifest (app name: Campus Saathi)
  icons/                App icons and favicon

  teacher_review/
    README.md           Notes on the reviews module and its Firestore layout
    teacher_review.js   Faculty directory array (ALL_FACULTY_DATA), Firestore
                        constants, and helper/search functions
    index.html          Earlier standalone page (v4.8)

  delivery/
    README.md           Notes on the parcel module and route-matching logic
    delivery.js         Parcel module code
    index.html          Earlier standalone page (v4.8)

  scratch/              Developer-only helper scripts and raw data. NOT loaded
                        by the app. See section 9.


------------------------------------------------------------------------------
5. DATA EMBEDDED IN index.html
------------------------------------------------------------------------------
Most of the file (roughly lines 338-2688) is data constants:

  ALL_FACULTY_DATA        Faculty directory, 326+ entries.
                          Fields: name, school, phone, room, email
  EXTRA_FACULTY_DATA      Extra teachers not in the main directory.
                          Fields: name, school, rawFaculty, subjects
  FRIENDS_DATA            Squad members and their registered courses.
                          Member fields: id, name, color, avatarBg, courses
                          Course fields: group, code, title, type, shortType,
                          credit, category, classNo, slots, venue, faculty
  TIME_COLUMNS            7 class periods (index, start, end, startMin,
                          endMin, label)
  DAY_MATRIX              MON-SAT: 7 slot codes per day
  DAY_FULL_NAMES          MON-SAT full names
  ACADEMIC_CALENDAR_EVENTS  ~28 events (id, title, displayDate, startDate,
                          endDate, dayOfWeek, type, typeLabel, note)

NOTE: ALL_FACULTY_DATA also exists as a copy in teacher_review/teacher_review.js.
The root index.html does not import that file, so edits must be made in
index.html for the live app. Keep the two in sync if you still use the module.


------------------------------------------------------------------------------
6. FIREBASE / FIRESTORE
------------------------------------------------------------------------------
Project config lives in index.html. The Firebase web config is not a secret,
but Firestore security rules decide who can read and write (see section 10).

6.1 Teacher reviews  - collection: teacher_reviews
  Reviews are stored in consolidated "chunk" documents to reduce read counts:

    teacher_reviews/all_reviews        first chunk
    teacher_reviews/all_reviews_1      next chunk after rollover
    teacher_reviews/all_reviews_2      and so on

  Chunk document:
    {
      reviews: [ { id, teacherId, teacherName, rawFaculty, school, rating,
                   classAvg, behavior, lateEntry, comment, timestamp }, ... ],
      lastUpdated: <ms timestamp>
    }

  - New reviews are appended with FieldValue.arrayUnion().
  - When a chunk reaches 80% of Firestore's 1 MiB document limit
    (about 838,860 bytes) the next review goes to the next chunk.
  - Older per-review documents are still read for backwards compatibility,
    and all chunks are merged in the client.
  - Constants: TEACHER_REVIEWS_COLLECTION_PATH, TEACHER_REVIEWS_DOC_ID,
    FIRESTORE_DOC_MAX_BYTES, FIRESTORE_DOC_THRESHOLD_BYTES
  - Helpers: formatTeacherId, calculateTeacherStats, searchFacultyDirectory,
    findFacultyByRoom, findFacultyByPhone, findFacultyByEmail

6.2 Parcel requests  - collection: deliveries
  Request document fields:
    docType ("parcel_request"), requester, courier, note, status
    ("open" / claimed / completed), claimedBy, location, timestamp, createdAt
    (plus an optional OTP field)

  - If writing to /deliveries is not permitted, the client falls back to
    syncing the same documents through /teacher_reviews with
    docType "parcel_request".
  - Completed requests are cleaned up by connected clients.

  Route matching priority (who is best placed to collect a parcel):
    100  In AB02 now, next slot free (walks past the parcel counter)
     95  Walking from AB02 to AB (crosses the counter passage)
     90  Walking from AB to AB02 (crosses the counter passage)
     85  Free now and next slot free
     75  Free right now, has class next slot
     65  In class now, free next slot


------------------------------------------------------------------------------
7. RUNNING LOCALLY
------------------------------------------------------------------------------
There is no build step. Serve the folder over http://localhost (service
workers do not run from file://):

    git clone https://github.com/dhrubasamal1/student-data.git
    cd student-data
    python3 -m http.server 8080

Open http://localhost:8080 in Chrome or Edge.
If you change files and still see old content, clear site data or unregister
the service worker in DevTools -> Application.


------------------------------------------------------------------------------
8. DEPLOYING (CLOUDFLARE PAGES)
------------------------------------------------------------------------------
  1. Connect this repository to a Cloudflare Pages project.
  2. Framework preset: None. Build command: (empty). Output directory: /
  3. Every push to main deploys automatically.
  4. Update the cache version in sw.js on each release so installed apps
     fetch the new files instead of serving the old cache.


------------------------------------------------------------------------------
9. UPDATING DATA
------------------------------------------------------------------------------
Faculty directory
  - Edit ALL_FACULTY_DATA (and EXTRA_FACULTY_DATA) in index.html.
  - scratch/ contains the one-off tooling used to build it:
      faculty_data.csv          raw faculty list (name, school code, phone,
                                room)
      faculty_js_block.js       earlier generated ALL_FACULTY_DATA array
      parse_faculty.js, build_faculty_code.js, generate_faculty_json.js,
      match_faculty.js, apply_faculty_updates.js, check_duplicates.js,
      fix_aditya.js, update_teacher_review_module.js
  - These scripts are developer tools only and are not served to users.

Timetables
  - Edit FRIENDS_DATA (slots, venue, faculty per course) and, if the period
    layout changes, TIME_COLUMNS and DAY_MATRIX.

Academic calendar
  - Edit ACADEMIC_CALENDAR_EVENTS.

Tests / simulations (run with Node.js, from the repo root)
  - scratch/test_*.js scripts check scheduling, matching, and squad logic:
      node scratch/test_match_scoring.js
      node scratch/test_simulation.js
    (Other scripts in scratch/ follow the same pattern.)

Icons
  - scratch/generate_icons.py (Python) regenerates the PWA icons into icons/.


------------------------------------------------------------------------------
10. PRIVACY AND SECURITY NOTES
------------------------------------------------------------------------------
  - This is a static site. Everything in index.html (including the faculty
    directory and squad timetables) is downloaded by every visitor and can be
    seen in browser DevTools.
  - The repository is public, and git history keeps older versions of files.
  - Firestore access is controlled only by the rules in the Firebase console
    (Firestore Database -> Rules). The module READMEs show the rules used
    during development, which allow open read/write on teacher_reviews and
    deliveries. Tighten them before a wide rollout.
  - Do not store sensitive data (OTPs, ID numbers) in Firestore.
  - Reviews are anonymous in the UI. Do not promise stronger anonymity than
    the data model provides.


------------------------------------------------------------------------------
11. PLANNED IMPROVEMENTS
------------------------------------------------------------------------------
  - Use one-time Firestore reads instead of a live listener for reviews, and
    refresh after a review is submitted (lower read and bandwidth cost)
  - Per-teacher review documents plus a small summary document
  - Anonymous sign-in, validated write rules, and Firebase App Check
  - Remove the OTP field and the /teacher_reviews fallback for parcels
  - Move faculty contact details out of the page (Cloudflare lookup function)
    and keep a single shared faculty data file instead of two copies
  - Optional: attendance tracker, CGPA calculator, FFCS planner with ratings,
    shareable timetable image, mess menu


------------------------------------------------------------------------------
12. CREDITS
------------------------------------------------------------------------------
Built by Dhruba Charan Samal, VIT Bhopal.
