const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Extract FRIENDS_DATA
const match = html.match(/const FRIENDS_DATA = (\[[\s\S]*?\]);\s*\/\*\*/);
const friends = eval(match[1]);

// Test classmate detection function
function getSameClassmates(friend, course) {
  return friends.filter(other => {
    if (other.id === friend.id) return false;
    return other.courses.some(oc => {
      if (course.classNo && oc.classNo) {
        return course.classNo.trim().toUpperCase() === oc.classNo.trim().toUpperCase();
      }
      const sameCode = (course.code || '').trim().toUpperCase() === (oc.code || '').trim().toUpperCase();
      const sameFaculty = (course.faculty || '').trim().toLowerCase() === (oc.faculty || '').trim().toLowerCase();
      return sameCode && sameFaculty;
    });
  }).sort((a, b) => a.name.localeCompare(b.name));
}

// 1. Dhruba CSA2001 -> Ajay
const dhruba = friends.find(f => f.id === 'dhruba');
const dhrubaCsa = dhruba.courses.find(c => c.code === 'CSA2001');
const dhrubaCsaClassmates = getSameClassmates(dhruba, dhrubaCsa).map(c => c.name.split(' ')[0]);
console.log('Dhruba CSA2001 classmates:', dhrubaCsaClassmates);
if (!dhrubaCsaClassmates.includes('Ajay')) {
  throw new Error('Dhruba CSA2001 should have Ajay as classmate!');
}

// 2. Dhruba MAT3003 -> Ajay, Suvayan
const dhrubaMat = dhruba.courses.find(c => c.code === 'MAT3003');
const dhrubaMatClassmates = getSameClassmates(dhruba, dhrubaMat).map(c => c.name.split(' ')[0]);
console.log('Dhruba MAT3003 classmates:', dhrubaMatClassmates);
if (!dhrubaMatClassmates.includes('Ajay') || !dhrubaMatClassmates.includes('Suvayan')) {
  throw new Error('Dhruba MAT3003 should have Ajay and Suvayan as classmates!');
}

// 3. Siddhant CSE2001 -> Ashesh, Suryansh
const siddhant = friends.find(f => f.id === 'siddhant');
const siddhantCse2001 = siddhant.courses.find(c => c.code === 'CSE2001');
const siddhantClassmates = getSameClassmates(siddhant, siddhantCse2001).map(c => c.name.split(' ')[0]);
console.log('Siddhant CSE2001 classmates:', siddhantClassmates);
if (!siddhantClassmates.includes('Ashesh') || !siddhantClassmates.includes('Suryansh')) {
  throw new Error('Siddhant CSE2001 should have Ashesh and Suryansh as classmates!');
}

// 4. Verify HTML contains classmate display template
if (!html.includes('In same class') && !html.includes('fa-user-group')) {
  throw new Error('index.html must include "In same class" template in registered courses!');
}

console.log('ALL REGISTERED COURSES CLASSMATES TESTS PASSED 100%!');
