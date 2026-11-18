const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const friendsMatch = html.match(/const FRIENDS_DATA\s*=\s*(\[[^;]+\]);\s*\/\*\*/s);
const FRIENDS_DATA = eval(friendsMatch[1]);

const dayMatrixMatch = html.match(/const DAY_MATRIX\s*=\s*(\{[^;]+?\n\s*\});/s);
const DAY_MATRIX = eval('(' + dayMatrixMatch[1] + ')');

const timeColMatch = html.match(/const TIME_COLUMNS\s*=\s*(\[[^;]+?\n\s*\]);/s);
const TIME_COLUMNS = eval(timeColMatch[1]);

function getFriendSlotMap(friend) {
  const map = {};
  friend.courses.forEach(c => {
    c.slots.forEach(s => {
      map[s.toUpperCase()] = c;
    });
  });
  return map;
}

const dhruba = FRIENDS_DATA.find(f => f.id === 'dhruba');
const day = 'MON';

console.log('Testing MON for Dhruba:');
TIME_COLUMNS.forEach((col, idx) => {
  const slotCode = DAY_MATRIX[day][idx];
  const dhrubaCourse = getFriendSlotMap(dhruba)[slotCode];

  // Let's see who among ALL other friends is in the same slot:
  const otherFriends = FRIENDS_DATA.filter(f => f.id !== dhruba.id);
  const sameSlotBusy = [];
  const sameClass = [];
  const sameSlotFree = [];

  otherFriends.forEach(other => {
    const otherCourse = getFriendSlotMap(other)[slotCode];
    if (otherCourse) {
      sameSlotBusy.push({ friend: other, course: otherCourse });
      if (dhrubaCourse && (otherCourse.code === dhrubaCourse.code || otherCourse.faculty === dhrubaCourse.faculty)) {
        sameClass.push(other);
      }
    } else {
      sameSlotFree.push(other);
    }
  });

  console.log(`Slot ${idx} (${slotCode}):`,
    dhrubaCourse ? `In Class (${dhrubaCourse.code})` : 'Free',
    '| Same Class:', sameClass.map(f => f.name.split(' ')[0]),
    '| Same Slot Busy:', sameSlotBusy.map(b => b.friend.name.split(' ')[0]),
    '| Free Friends:', sameSlotFree.map(f => f.name.split(' ')[0])
  );
});
