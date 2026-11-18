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

// Test with Aditya on MON
const aditya = FRIENDS_DATA.find(f => f.id === 'aditya');
const day = 'MON';

console.log('Testing MON for Aditya:');
TIME_COLUMNS.forEach((col, idx) => {
  const slotCode = DAY_MATRIX[day][idx];
  const soleCourse = getFriendSlotMap(aditya)[slotCode];
  const otherFriends = FRIENDS_DATA.filter(f => f.id !== aditya.id);

  const sameClassFriends = [];
  const sameSlotBusyFriends = [];
  const sameSlotFreeFriends = [];

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

  console.log(`Slot ${idx} (${slotCode}, ${col.start} - ${col.end}):`);
  if (soleCourse) {
    console.log(`  Aditya in class: ${soleCourse.code} (${soleCourse.title}) at ${soleCourse.venue}`);
    if (sameClassFriends.length > 0) {
      console.log(`  -> In your class (${sameClassFriends.length}):`, sameClassFriends.map(c => c.friend.name.split(' ')[0]).join(', '));
    }
    if (sameSlotBusyFriends.length > 0) {
      console.log(`  -> In same slot (${sameSlotBusyFriends.length}):`, sameSlotBusyFriends.map(c => `${c.friend.name.split(' ')[0]} (${c.course.code})`).join(', '));
    }
  } else {
    console.log(`  Aditya is Free!`);
    if (sameSlotFreeFriends.length > 0) {
      console.log(`  -> Free with you (${sameSlotFreeFriends.length}):`, sameSlotFreeFriends.map(f => f.name.split(' ')[0]).join(', '));
    }
    if (sameSlotBusyFriends.length > 0) {
      console.log(`  -> In class this slot (${sameSlotBusyFriends.length}):`, sameSlotBusyFriends.map(c => `${c.friend.name.split(' ')[0]} (${c.course.code})`).join(', '));
    }
  }
});
